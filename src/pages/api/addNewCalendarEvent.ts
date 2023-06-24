import { NextApiRequest, NextApiResponse } from "next";
import { addNewCalendarEventApi } from "../../apis";
import moment from "moment";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const body = JSON.parse(req.body);
            await addNewCalendarEventApi(body);
            return res.status(200).json({ message: `${body.summary} added on ${moment(body.start.dateTime).format('DD/MM/yyyy')}!` });
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }
}