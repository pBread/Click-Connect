import jsforce from "jsforce";
import type { NextApiHandler } from "next";
import Twilio from "twilio";

const {
  ACCOUNT_SID,
  AUTH_TOKEN,
  SF_USERNAME,
  SF_PASSWORD,
  SF_TOKEN,
  SYNC_SVC_SID,
} = process.env;
const client = Twilio(ACCOUNT_SID, AUTH_TOKEN);
const conn = new jsforce.Connection({});

const handler: NextApiHandler = async (req, res) => {
  console.log({ ...(req.query || {}), ...(req.body || {}) });

  await conn.login(SF_USERNAME, `${SF_PASSWORD}${SF_TOKEN}`);
  await conn
    .sobject("Lead")
    .find()
    .then((items) =>
      items.map((it) => conn.sobject("lead").delete(it.Id as string))
    );

  const items = await client.sync
    .services(SYNC_SVC_SID)
    .syncMaps("CodeMap")
    .syncMapItems.list();

  await Promise.all(
    items.map((item) =>
      client.sync
        .services(SYNC_SVC_SID)
        .syncMaps("CodeMap")
        .syncMapItems(item.key)
        .remove()
    )
  );

  res.send({ removed: items.length });
};

export default handler;
