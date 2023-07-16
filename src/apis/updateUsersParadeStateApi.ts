import { google } from "googleapis";
import gapiAuth from "./gapiAuth";
import { SHEET, valueInputOption } from "../constants";
import moment from "moment";

interface UpdateUsersParadeStateApi {
    usersData: { rank, name, newState }[],
    now: string,
    isFirstParade: boolean
}

export default async function updateUsersParadeStateApi({ usersData, now, isFirstParade }: UpdateUsersParadeStateApi) {
    const sheets = await google.sheets({ version: 'v4', auth: gapiAuth() });

    const res1 = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${SHEET.PARADE_STATE}!B4:C`
    });

    const rowIndexAndNewStateMap = new Map<number, { values: string[][], range: string }>();
    const rows = res1.data.values;
    if (!rows) {
        throw new Error('Unable to get data');
    }
    const colIndex = moment(now).day() * 2 + (isFirstParade ? 3 : 4);
    for (let i = 0; i < rows.length; i++) {
        for (const { name, rank, newState } of usersData) {
            if (rows[i][0] === name && rows[i][1] === rank) {
                const rowIndex = i + 4
                rowIndexAndNewStateMap.set(rowIndex, { values: [[newState]], range: `${SHEET.PARADE_STATE}!${String.fromCharCode(64 + colIndex) + rowIndex}` });
            }
        }
    }

    const res2 = await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        requestBody: {
            valueInputOption: valueInputOption,
            data: Array.from(rowIndexAndNewStateMap.keys()).map((key) => (rowIndexAndNewStateMap.get(key))) as any
        }
    })

    return res2.data.totalUpdatedCells;
}