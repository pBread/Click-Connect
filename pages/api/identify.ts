import type { NextApiHandler, NextApiRequest } from "next";
import Twilio from "twilio";

const { ACCOUNT_SID, AUTH_TOKEN, SYNC_SVC_SID } = process.env;
const client = Twilio(ACCOUNT_SID, AUTH_TOKEN);

/****************************************************
 Get Handlers
****************************************************/
const getIdSMS: NextApiHandler = async ({ query }, res) => {
  const msg = query.body as string;
  const match = msg.match(/(\([0-9]{6}\))/);
  if (!match) res.status(500).end();
  else res.json(await getItem(match[0]?.replace(/\(|\)/g, "")));
};

const getIdVoice: NextApiHandler = async ({ query }, res) => {
  const data = await getItem(query.code as string);
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
  console.log("/api/identify==\n", req.method, req.body, req.query);
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
