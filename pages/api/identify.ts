import type { NextApiHandler, NextApiRequest } from "next";
import Twilio from "twilio";

const { ACCOUNT_SID, AUTH_TOKEN, SYNC_SVC_SID } = process.env;
const client = Twilio(ACCOUNT_SID, AUTH_TOKEN);

/****************************************************
 Get Handlers
****************************************************/
const getIdSMS: NextApiHandler = async (req, res) => {
  const data = getItem(getCode(req) || getId(req));
  res.json(data);
};

const getIdVoice: NextApiHandler = async (req, res) => {
  const match = req.body.body.match(/(\([0-9]{6}\))/);
  const code = match[0]?.replace(/\(|\)/g, "");

  const data = getItem(code);
  res.json(data);
};

async function getItem(key: string) {
  return await client.sync
    .services(SYNC_SVC_SID)
    .syncMaps("CodeMap")
    .syncMapItems(key)
    .fetch()
    .then(({ data }) => data as { code: string; id: string });
}

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
  if (req.method === "POST") return postHandler(req, res);
  else if (req.query.channel === "sms") return getIdSMS(req, res);
  else if (req.query.channel === "voice") return getIdVoice(req, res);
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
