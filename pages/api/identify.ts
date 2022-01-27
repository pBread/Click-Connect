import type { NextApiHandler, NextApiRequest } from "next";
import Twilio from "twilio";

const { ACCOUNT_SID, AUTH_TOKEN, SYNC_SVC_SID } = process.env;
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
      .then(({ data }) => data.code);
  else
    id = await client.sync
      .services(SYNC_SVC_SID)
      .syncMaps("CodeMap")
      .syncMapItems(code)
      .fetch()
      .then(({ data }) => data.id);

  res.json({ code, id });
};

const postHandler: NextApiHandler = async (req, res) => {
  const code = getCode(req);
  const id = getId(req);

  await Promise.all([
    client.sync.services(SYNC_SVC_SID).syncMaps("CodeMap").syncMapItems.create({
      data: { code, id },
      key: id,
      ttl: 3600, // seconds
    }),
    client.sync.services(SYNC_SVC_SID).syncMaps("CodeMap").syncMapItems.create({
      data: { code, id },
      key: code,
      ttl: 3600, // seconds
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

function getId({ body, query }: NextApiRequest) {
  return query.userId || query.anonymousId || body?.userId || body?.anonymousId;
}
