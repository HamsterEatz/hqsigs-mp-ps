import moment from "moment";
import { google } from 'googleapis';
import gapiAuth from "./gapiAuth";

export default async function paradeStateApi(isFirstParade) {
    const now = moment();
    const currentDay = now.day();
    if (currentDay === 0 || currentDay === 6) {
        throw new Error('Parade State not available on weekends!');
    }

    const sheets = google.sheets({ version: 'v4', auth: gapiAuth() });

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Parade State (1)!A4:N',
    });

    const values = response.data.values || [];


    return filterData({ currentDay, isFirstParade, values });
}

function filterData({ currentDay, isFirstParade, values }) {
    let present: any = [];
    let absent: any = [];
    let unaccounted: any = [];
    for (const value of values) {
        if (!isNaN(Number(value[0])) && value[1]) {
            const state = value[currentDay * 2 + (isFirstParade ? 1 : 2)];
            if (state) {
                if (state.toUpperCase() === 'PRESENT') {
                    present.push({ name: value[1], rank: value[2] });
                } else {
                    // TODO: Add algo for absent
                    absent.push({ name: value[1], rank: value[2], state });
                }
            } else {
                unaccounted.push({ name: value[1], rank: value[2] });
            }
        }
    }

    return { present, absent, unaccounted };
}