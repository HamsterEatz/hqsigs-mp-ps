import { google } from "googleapis";
import gapiAuth from "./gapiAuth";

export default async function clearDataApi() {
    const sheets = google.sheets({ version: 'v4', auth: gapiAuth() });

    const response = await sheets.spreadsheets.values.clear({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Test!D4:M',
    });

    return response.data.clearedRange;
}