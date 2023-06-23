import { google } from "googleapis";
import gapiAuth from "./gapiAuth";
import { ENV } from "../constants";

export default async function getSheetByName(name) {
    const sheets = google.sheets({ version: 'v4', auth: gapiAuth() });

    const fetchSheetsResponse = await sheets.spreadsheets.get({
        spreadsheetId: ENV.SPREADSHEET_ID,
    });

    const currSheets = fetchSheetsResponse.data.sheets;
    for (const sheet of currSheets || []) {
        if (sheet.properties?.title === name) {
            return sheet;
        }
    }

    throw new Error('Unable to find sheet');
}