import jsforce from "jsforce";
import type { NextApiHandler } from "next";
import Twilio from "twilio";

const { ACCOUNT_SID, AUTH_TOKEN, SF_USERNAME, SF_PASSWORD, SF_TOKEN } =
  process.env;
const client = Twilio(ACCOUNT_SID, AUTH_TOKEN);
const conn = new jsforce.Connection({});

const handler: NextApiHandler = async (req, res) => {
  console.log("==api/salesforce==\n", req.query);

  const { id, Phone } = req.query;

  await conn.login(SF_USERNAME, `${SF_PASSWORD}${SF_TOKEN}`);
  const lead = (await conn
    .sobject("Lead")
    .create({ Company: "N/A", LastName: id, Phone, MobilePhone: Phone })) as {
    id: string;
  };

  res.status(200).end();
};

export default handler;
