import { Handler, HandlerEvent } from "@netlify/functions";
import { transliterate, Schema } from "hebrew-transliteration";

const handler: Handler = async (event: HandlerEvent, context) => {
  try {
    if (event.httpMethod !== "POST") {
      throw await Promise.reject({
        message: `${event.httpMethod} Not Allowed`,
      });
    }
    const body: { text: string; schema: Schema } = JSON.parse(event.body);
    // do some checking here first
    const transliteration = transliterate(body.text, body.schema);
    const response = { transliteration: transliteration };
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
