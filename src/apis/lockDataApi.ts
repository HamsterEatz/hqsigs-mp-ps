import { google } from "googleapis";
import gapiAuth from "./gapiAuth";
import { SHEET } from "../constants";
import getSheetByName from "./getSheetByName";

export default async function fetchAndOrToggleLockDataApi(fetchOnly = true) {
    const sheets = google.sheets({ version: 'v4', auth: gapiAuth() });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL || "";
    const OP_EMAILS = process.env.GOOGLE_OP_EMAILS!!.split(",");

    const sheet = await getSheetByName(SHEET.PARADE_STATE);
    let protectedRangeId;
    const rangeDescription = 'Disable edit';
    for (const range of sheet.protectedRanges || []) {
        if (range.description === rangeDescription) {
            protectedRangeId = range.protectedRangeId;
            break;
        }
    }

    if (fetchOnly) {
        return protectedRangeId ? true : false;
    }

    await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [
                protectedRangeId ? {
                    deleteProtectedRange: {
                        protectedRangeId
                    }
                } : {
                    addProtectedRange: {
                        protectedRange: {
                            range: {
                                sheetId: sheet.properties?.sheetId,
                                startRowIndex: 3,
                                startColumnIndex: 4,
                                endColumnIndex: 14,
                            },
                            description: rangeDescription,
                            editors: {
                                users: [CLIENT_EMAIL, ...OP_EMAILS]
                            }
                        },
                    }
                }
            ]
        }
    });

    return protectedRangeId ? false : true;
}