import { NextApiRequest, NextApiResponse } from "next";
import { TELEGRAM_BOT_BASE_URL } from "../../../constants";
import { paradeStateApi } from "../../../apis";
import moment from "moment";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const now = moment();
        const isFirstParade = now.hours() < 9 ? true : false;
        const { present, absent, unaccounted } = await paradeStateApi(isFirstParade, now);

        let text = `*${now.format('DD/MM/YY')} ${isFirstParade ? 'First' : 'Last'} Parade - Manpower Br*%0A%0A*Present*:`;
        for (let i = 0; i < present.length; i++) {
            text += `%0A${i + 1}) ${present[i].rank} ${present[i].name}`;
        }
        if (absent.length > 0) {
            text += '%0A%0A*Absent*:';
            for (let i = 0; i < absent.length; i++) {
                text += `%0A${i + 1}) ${absent[i].rank} ${absent[i].name} (${absent[i].state})`;
            }
        }
        if (unaccounted.length > 0) {
            text += '%0A%0A*Unaccounted*:';
            for (let i = 0; i < unaccounted.length; i++) {
                const rank = unaccounted[i].rank;
                const name = unaccounted[i].name;
                text += `%0A${i + 1}) ${rank} ${name}`;
            }
        }

        const chatId = process.env.TELEGRAM_CHANNEL_ID;
        const url1 = `${TELEGRAM_BOT_BASE_URL}sendMessage?chat_id=${chatId}&text=${text}`;
        const teleRes1 = await fetch(url1);
        if (!teleRes1.ok) {
            throw new Error(teleRes1.statusText);
        }

        if (unaccounted.length > 0) {
            const text2 = unaccounted.reduce((acc, curVal) => {
                const { name, rank, contact } = curVal;
                acc += `%0A${rank} ${name} → <a href='https://wa.me/65${contact}'>${contact}</a>`;
                return acc;
            }, "<b><u>Here are the following unaccounted contacts:</u></b>");
            const url2 = `${TELEGRAM_BOT_BASE_URL}sendMessage?chat_id=${chatId}&text=${text2}&parse_mode=HTML`;
            const teleRes2 = await fetch(url2);
            if (!teleRes2.ok) {
                throw new Error(teleRes2.statusText);
            }
        }
        return res.status(201).json({ message: teleRes1.statusText });
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
}