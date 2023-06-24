import { GoogleAuth } from "google-auth-library";
import { ENV } from "../constants";

export default function gapiAuth() {
    const auth = new GoogleAuth({
        credentials: {
            client_id: ENV.CLIENT_ID,
            client_email: ENV.CLIENT_EMAIL,
            private_key: ENV.PRIVATE_KEY!!.split(String.raw`\n`).join('\n')
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/documents.readonly',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events']
    });

    return auth;
}