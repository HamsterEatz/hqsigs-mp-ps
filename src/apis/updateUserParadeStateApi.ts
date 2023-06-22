import { google } from "googleapis";
import gapiAuth from "./gapiAuth";
import { ENV, SHEET } from "../constants";
import moment from "moment";

export default async function updateUserParadeStateApi({rank, name, newState, now, isFirstParade}) {
    const sheets = await google.sheets({ version: 'v4', auth: gapiAuth() });

    const res1 = await sheets.spreadsheets.values.get({
        spreadsheetId: ENV.SPREADSHEET_ID,
        range: `${SHEET.PARADE_STATE}!B4:C`
    });

    const rowIndex = res1.data.values!!.findIndex((col) => col[0] === name && col[1] === rank) + 4;

    const colIndex = moment(now).day() * 2 + (isFirstParade ? 3 : 4);
    
    const res2 = await sheets.spreadsheets.values.update({
        spreadsheetId: ENV.SPREADSHEET_ID,
        range: `${SHEET.PARADE_STATE}!${String.fromCharCode(64 + colIndex) + rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [[newState]]
        }
    });

    return res2;
}