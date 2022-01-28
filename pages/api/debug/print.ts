import type { NextApiHandler } from "next";
import Twilio from "twilio";

const { ACCOUNT_SID, AUTH_TOKEN } = process.env;
const client = Twilio(ACCOUNT_SID, AUTH_TOKEN);

const handler: NextApiHandler = async (req, res) => {
  console.log("==api/debug/print==\n", req.body);

  res.json({});
};

export default handler;
