import { google } from "googleapis";
import gapiAuth from "./gapiAuth";
import { SHEET, valueInputOption } from "../constants";

export default async function addUserApi({ name, rank, contact }) {
    if (!name || !rank || !contact) {
        throw new Error('Name, rank or contact was not specified!');
    }

    const sheets = await google.sheets({ version: 'v4', auth: gapiAuth() });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const res1 = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${SHEET.PARADE_STATE}!A4:A`
    });

    const serialNumber = res1.data.values!!.length + 1;

    await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: SHEET.PARADE_STATE,
        valueInputOption: valueInputOption,
        requestBody: {
            values: [[serialNumber, name, rank, contact]]
        }
    });

    return { name, rank, contact };
}