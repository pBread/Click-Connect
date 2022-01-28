import type { NextApiHandler, NextApiRequest } from "next";
import Twilio from "twilio";

const { ACCOUNT_SID, AUTH_TOKEN, SYNC_SVC_SID } = process.env;
const client = Twilio(ACCOUNT_SID, AUTH_TOKEN);

const handler: NextApiHandler = async (req, res) => {
  console.log({ ...(req.query || {}), ...(req.body || {}) });

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
