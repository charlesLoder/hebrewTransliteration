import { Handler, HandlerEvent } from "@netlify/functions";
import { GoogleSpreadsheet } from "google-spreadsheet";

/**
 * send errors from transliterate page to Google sheet
 * @param event
 * @param context
 * @returns figure out what is returned from sheets
 */
const handler: Handler = async (event: HandlerEvent, context) => {
  try {
    if (event.httpMethod !== "POST") {
      throw await Promise.reject({
        message: `${event.httpMethod} Not Allowed`,
      });
    }

    const doc = new GoogleSpreadsheet(process.env.SHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[process.env.SHEET_TITLE];

    if (!event.body) throw new Error("No event body");

    const body: { text: string; error: string; browser: string } = JSON.parse(event.body);
    const resp = await sheet.addRow({
      Date: new Date().toLocaleDateString("en-CA").toString(),
      Input: body.text,
      Error: body.error,
      Browser: body.browser,
    });

    return {
      statusCode: 200,
      headers: {
        "access-control-allow-origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: `Wrote to row ${resp?._rowNumber || 0}` }),
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
