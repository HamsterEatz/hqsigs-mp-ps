import { google } from "googleapis";
import gapiAuth from "./gapiAuth";
import { SHEET } from "../constants";

export default async function contactsApi() {
    const sheets = google.sheets({ version: 'v4', auth: gapiAuth() });

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${SHEET.CONTACT_LIST}!A4:C`,
    });

    const values = response.data.values || [];

    return values.map((value) => ({
        rank: value[0],
        name: value[1],
        contact: value[2]
    }));
}