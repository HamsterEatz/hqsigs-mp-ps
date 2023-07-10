import { google } from "googleapis";
import gapiAuth from "./gapiAuth";
import { SHEET } from "../constants";

export default async function getUsersApi() {
    const sheets = await google.sheets({ version: 'v4', auth: gapiAuth() });

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${SHEET.PARADE_STATE}!A4:D`
    });

    const values = response.data.values || [];

    return values.filter((v) => (v[0] && v[1] && v[2])).map((v) => ({
        userId: v[0],
        name: v[1],
        rank: v[2],
        contact: v[3]
    }));
}