import type { NextApiHandler, NextApiRequest } from "next";
import Twilio from "twilio";

const { ACCOUNT_SID, AUTH_TOKEN, SYNC_SVC_SID } = process.env;
const client = Twilio(ACCOUNT_SID, AUTH_TOKEN);

/****************************************************
 Get Handler
****************************************************/
const getHandler: NextApiHandler = async (req, res) => {
  const data = await client.sync
    .services(SYNC_SVC_SID)
    .syncMaps("CodeMap")
    .syncMapItems(getCode(req) || getId(req))
    .fetch()
    .then(({ data }) => data as { code: string; id: string });

  res.json(data);
};

/****************************************************
 Post Handler
****************************************************/
const postHandler: NextApiHandler = async (req, res) => {
  const code = getCode(req);
  const id = getId(req);
  const data = { code, id };

  await Promise.all([setItem(code, data), setItem(id, data)]);

  res.status(200).end();
};

async function setItem(key: string, data: object) {
  await client.sync
    .services(SYNC_SVC_SID)
    .syncMaps("CodeMap")
    .syncMapItems(key)
    .remove()
    .catch(() => {});

  await client.sync
    .services(SYNC_SVC_SID)
    .syncMaps("CodeMap")
    .syncMapItems.create({ data, key, ttl: 3600 });
}

/****************************************************
 Route Handler
****************************************************/
const handler: NextApiHandler = async (req, res) => {
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
function getCode({ body, query }: NextApiRequest) {
  return query.code || body.code;
}

function getId({ body, query }: NextApiRequest) {
  return query.id || body.id;
}
