import { GoogleAuth } from "google-auth-library";

export default function gapiAuth() {
    const auth = new GoogleAuth({
        credentials: {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY!!.split(String.raw`\n`).join('\n')
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/documents.readonly']
    });

    return auth;
}