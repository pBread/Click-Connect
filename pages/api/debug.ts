// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handler: NextApiHandler = async (req, res) => {
  console.log({ ...(req.query || {}), ...(req.body || {}) });

  res.send({});
};

export default handler;
