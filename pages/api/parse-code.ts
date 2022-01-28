import type { NextApiHandler, NextApiRequest } from "next";
import Twilio from "twilio";

const { ACCOUNT_SID, AUTH_TOKEN, SYNC_SVC_SID } = process.env;
const client = Twilio(ACCOUNT_SID, AUTH_TOKEN);

/****************************************************
 Route Handler
****************************************************/
const handler: NextApiHandler = async (req, res) => {
  console.log("==api/print-code==\n", req.body);

  const match = req.body.body.match(/(\([0-9]{6}\))/);
  const code = match[0]?.replace(/\(|\)/g, "");

  const data = await client.sync
    .services(SYNC_SVC_SID)
    .syncMaps("CodeMap")
    .syncMapItems(code)
    .fetch()
    .then(({ data }) => data as { code: string; id: string });

  res.json(data);
};

export default handler;
