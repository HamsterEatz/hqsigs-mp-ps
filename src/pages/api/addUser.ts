import { NextApiRequest, NextApiResponse } from "next";
import { addUserApi } from "../../apis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = req.body;
    const { name, rank, contact } = body;
   
    if (!name && !rank && !contact) {
      return res.status(400).json({ error: 'Name, rank and contact not found!' });
    }
   
    await addUserApi({ name, rank, contact });
    return res.status(200).json({ data: `Added ${rank} ${name} with contact (${contact})` });
  }