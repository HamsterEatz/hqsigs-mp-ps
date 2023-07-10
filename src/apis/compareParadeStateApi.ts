import { google } from 'googleapis';
import gapiAuth from "./gapiAuth";
import { LEGENDS, SHEET } from "../constants";
import moment from 'moment';

export default async function compareParadeStateApi(isFirstParade, oldStateData, now: moment.Moment = moment()) {
    const sheets = google.sheets({ version: 'v4', auth: gapiAuth() });

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${SHEET.PARADE_STATE_SNAPSHOT}!A1:C`,
    });

    const values = response.data.values || [];

    const currentSnapshotDetails = values[0][0].split(' ');
    const date = moment(currentSnapshotDetails[0], 'DD/MM');

    const currentDay = now.day();
    if (currentDay !== date.day() || (isFirstParade ? currentSnapshotDetails[1] !== 'First' : currentSnapshotDetails[1] !== 'Last')) {
        return;
    }

    const { absent, present, unaccounted } = oldStateData;
    const paradeStateData = [...absent, ...present.map(v => ({ ...v, state: LEGENDS.PRESENT })),
    ...unaccounted.map(v => ({ ...v, state: LEGENDS.UNACCOUNTED }))];
    const diffArr: any[] = [];

    for (const person of values.splice(0)) {
        for (const data of paradeStateData) {
            const name = person[0];
            const rank = person[1];
            const oldState = person[2]?.split('from')[0]?.trim() || LEGENDS.UNACCOUNTED;

            if (data.name === name && data.rank === rank) {
                const newState = data?.state?.split('from')[0]?.trim() || LEGENDS.UNACCOUNTED;
                if (oldState.toUpperCase() !== newState.toUpperCase()) {
                    diffArr.push({ name, rank, newState, oldState });
                }
                break;
            }
        }
    }

    return diffArr;
}