import type { NextApiHandler } from "next";
import Twilio from "twilio";
import jsforce from "jsforce";

const { ACCOUNT_SID, AUTH_TOKEN, SYNC_SVC_SID } = process.env;
const client = Twilio(ACCOUNT_SID, AUTH_TOKEN);

const { SF_USERNAME, SF_PASSWORD, SF_TOKEN } = process.env;
const conn = new jsforce.Connection({});

/****************************************************
 Get Handlers
****************************************************/
const getIdSMS: NextApiHandler = async ({ query }, res) => {
  const msg = query.body as string;
  const match = msg.match(/(\([0-9]{6}\))/);

  await conn.login(SF_USERNAME, `${SF_PASSWORD}${SF_TOKEN}`);
  const contact = await conn.sobject("Contact").findOne({ Phone: query.from });

  if (contact) {
    await conn.login(SF_USERNAME, `${SF_PASSWORD}${SF_TOKEN}`);
    const contact = await conn
      .sobject("Contact")
      .findOne({ Phone: query.from });

    res.json({
      code: "n/a",
      id: contact?.Id,
      identity: contact?.Id, // @ts-ignore
      name: contact?.FirstName,
    });
  } else if (match) res.json(await getItem(match[0]?.replace(/\(|\)/g, "")));
  else res.status(500).end();
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
    .then(
      ({ data }) =>
        ({ ...data, identity: "anon" } as { code: string; id: string })
    );
}

/****************************************************
 Post Handler
****************************************************/
const postHandler: NextApiHandler = async ({ body }, res) => {
  const code = body.code;
  const id = body.id;
  const data = { code, id };

  await client.sync
    .services(SYNC_SVC_SID)
    .syncMaps("CodeMap")
    .syncMapItems(code)
    .remove()
    .catch(() => {});

  await client.sync
    .services(SYNC_SVC_SID)
    .syncMaps("CodeMap")
    .syncMapItems.create({ data, key: code, ttl: 3600 });

  res.status(200).end();
};

/****************************************************
 Route Handler
****************************************************/
const handler: NextApiHandler = async (req, res) => {
  console.log("/api/identify==\n", {
    method: req.method,
    body: JSON.parse(JSON.stringify(req.body)),
    query: req.query,
  });
  if (req.method === "POST") return postHandler(req, res);
  else if (req.query.channel === "voice") return getIdVoice(req, res);
  else if (req.query.channel === "sms") return getIdSMS(req, res);
};

export default handler;
