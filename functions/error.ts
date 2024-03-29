import { Handler, HandlerEvent } from "@netlify/functions";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

/**
 * send errors from transliterate page to Google sheet
 * @param event
 * @param context
 * @returns figure out what is returned from sheets
 */
const handler: Handler = async (event: HandlerEvent, context) => {
  try {
    if (event.httpMethod !== "POST") throw new Error(`${event.httpMethod} Not Allowed`);
    if (!event.body) throw new Error("No event body");

    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/gm, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(process.env.SHEET_ID || "", serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[process.env.SHEET_ERROR_TITLE || ""];

    const body: { text: string; error: string; path: string; options: string; browser: string } =
      JSON.parse(event.body);
    const resp = await sheet.addRow({
      Date: new Date().toLocaleDateString("en-CA").toString(),
      Input: body.text,
      Error: body.error,
      Page: body.path,
      Options: body.options,
      Browser: body.browser,
    });

    return {
      statusCode: 200,
      headers: {
        "access-control-allow-origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: `Wrote to row ${resp.rowNumber || 0}` }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      headers: {
        "access-control-allow-origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(error),
    };
  }
};

export { handler };
