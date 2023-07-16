import { NextApiRequest, NextApiResponse } from "next";
import { updateUsersParadeStateApi } from "../../apis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const body = JSON.parse(req.body);
            const { now, usersData, isFirstParade } = body;
            const noOfCells = await updateUsersParadeStateApi({ usersData, isFirstParade, now });
            res.status(200).json({ message: `Updated ${noOfCells} records!` });
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    }
}