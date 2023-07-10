import { google } from "googleapis";
import gapiAuth from "./gapiAuth";
import { RANKS, SHEET, getRankHierarchy, valueInputOption } from "../constants";

export default async function modifyUserRankApi(user: { id: number, rank: string, name: string }, isPromote: boolean) {
    const sheets = await google.sheets({ version: 'v4', auth: gapiAuth() });

    const { rank, name } = user;
    const id = Number(user.id);
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const rowClaim = id + 3;

    const rows = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${SHEET.PARADE_STATE}!A${rowClaim}:C${rowClaim}`
    });
    const cols = rows.data.values!![0];
    if (cols[0] !== id && cols[1] !== name && cols[2] !== rank) {
        throw new Error('Trying to modify rank with user data mismatched!');
    }

    await sheets.spreadsheets.values.update({
        spreadsheetId,
        valueInputOption: valueInputOption,
        range: `${SHEET.PARADE_STATE}!C${rowClaim}`,
        requestBody: {
            values: [[getRank(rank, isPromote)]]
        }
    });
}

function getRank(currentRank: string, isPromote: boolean) {
    const currentRankIndex = getRankHierarchy(currentRank);
    for (const rank of Object.values(RANKS)) {
        if (getRankHierarchy(rank) === (isPromote ? currentRankIndex + 1 : currentRankIndex - 1)) {
            return rank;
        }
    }
}