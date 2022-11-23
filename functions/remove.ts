import { Handler, HandlerEvent } from "@netlify/functions";
import { remove } from "hebrew-transliteration";

const handler: Handler = async (event: HandlerEvent, context) => {
  try {
    if (event.httpMethod !== "POST") throw new Error(`${event.httpMethod} Not Allowed`);
    if (!event.body) throw new Error("No event body");

    const body: { text: string; options } = JSON.parse(event.body);
    const removed = remove(body.text, body.options);
    const response = { text: removed };
    return {
      statusCode: 200,
      headers: {
        "access-control-allow-origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
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
