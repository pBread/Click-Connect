import type { NextApiHandler } from "next";
import Twilio from "twilio";

const { ACCOUNT_SID, AUTH_TOKEN, SYNC_SVC_SID } = process.env;
const client = Twilio(ACCOUNT_SID, AUTH_TOKEN);

const getByCode: NextApiHandler = async (req, res) => {};

const getById: NextApiHandler = async (req, res) => {};

const postHandler: NextApiHandler = async (req, res) => {
  const identifier = req.body?.userId || req.body?.anonymousId;

  for (var i = 0, code = ""; i < 6; i++)
    code += "0123456789"[Math.floor(Math.random() * 10)];

  const data = { code };

  await client.sync
    .services(SYNC_SVC_SID)
    .syncMaps("CodeMap")
    .syncMapItems.create({
      data,
      key: identifier,
      ttl: 60, // 1 minute
    });

  res.send(data);
};

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "GET":
      getHandler(req, res);

    case "POST":
      postHandler(req, res);

    default:
      throw Error("Invalid method");
  }
};

export default handler;
