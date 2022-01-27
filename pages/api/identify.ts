import type { NextApiHandler, NextApiRequest } from "next";
import Twilio from "twilio";

const { ACCOUNT_SID, CODE_SECRET, AUTH_TOKEN, SYNC_SVC_SID } = process.env;
const client = Twilio(ACCOUNT_SID, AUTH_TOKEN);

const getHandler: NextApiHandler = async (req, res) => {
  let code = getCode(req);
  let id = getId(req);

  if (!code)
    code = await client.sync
      .services(SYNC_SVC_SID)
      .syncMaps("CodeMap")
      .syncMapItems(id)
      .fetch()
      .then((item) => item.data.code);
  else
    id = await client.sync
      .services(SYNC_SVC_SID)
      .syncMaps("CodeMap")
      .syncMapItems(code)
      .fetch()
      .then((item) => item.data.id);

  res.json({ code, id });
};

const postHandler: NextApiHandler = async (req, res) => {
  const code = getCode(req);
  const id = getId(req);

  await Promise.all([
    client.sync
      .services(SYNC_SVC_SID)
      .syncMaps("CodeMap")
      .syncMapItems.create({
        data: { code, id },
        key: id,
        ttl: 60 * 60, // seconds
      }),
    client.sync
      .services(SYNC_SVC_SID)
      .syncMaps("CodeMap")
      .syncMapItems.create({
        data: { code, id },
        key: code,
        ttl: 60 * 60, // seconds
      }),
  ]);

  res.status(200).end();
};

const handler: NextApiHandler = (req, res) => {
  switch (req.method) {
    case "GET":
      return getHandler(req, res);

    case "POST":
      return postHandler(req, res);
  }
};

export default handler;

/****************************************************
 Helpers
****************************************************/
function getCode(req: NextApiRequest) {
  return req.query.code || req.body?.code;
}

function getId(req: NextApiRequest) {
  return (
    req.query.userId ||
    req.query.anonymousId ||
    req.body?.userId ||
    req.body?.anonymousId
  );
}
