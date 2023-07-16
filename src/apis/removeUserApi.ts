import { google } from "googleapis";
import gapiAuth from "./gapiAuth";
import { SHEET, valueInputOption } from "../constants";

export default async function removeUserApi(userId: number) {
    const sheets = google.sheets({ version: 'v4', auth: gapiAuth() });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const fetchSheetsResponse = await sheets.spreadsheets.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });
    const sheetTitleIdMap = new Map<string, number>();
    for (const sheet of fetchSheetsResponse.data.sheets || []) {
        const sheetId = sheet.properties?.sheetId;
        const title = sheet.properties?.title;
        if (sheetId && title) {
            sheetTitleIdMap.set(title, sheetId);
        }
    }

    // Remove row from parade state sheet
    await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [{
                deleteDimension: {
                    range: {
                        sheetId: sheetTitleIdMap.get(SHEET.PARADE_STATE),
                        dimension: "ROWS",
                        startIndex: 2 + Number(userId),
                        endIndex: 3 + Number(userId)
                    }
                },
            }]
        }
    });

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${SHEET.PARADE_STATE}!A4:A`
    });

    const values = response.data.values;

    // Reassign S/N on parade state sheet
    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${SHEET.PARADE_STATE}!A4:A`,
        valueInputOption: valueInputOption,
        requestBody: {
            values: Array.from({ length: values!!.length }, (_, i) => [i + 1])
        }
    });
}