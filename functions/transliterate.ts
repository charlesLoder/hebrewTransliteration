import { Handler, HandlerEvent } from "@netlify/functions";
import { transliterate, Schema } from "hebrew-transliteration";

const handler: Handler = async (event: HandlerEvent, context) => {
  try {
    if (event.httpMethod !== "POST") throw new Error(`${event.httpMethod} Not Allowed`);
    if (!event.body) throw new Error("No event body");

    const body: { text: string; schema: Schema } = JSON.parse(event.body);
    const transliteration = transliterate(body.text, body.schema);

    // just curious to see what people are using it for
    console.log(body.text);
    console.log(transliteration);

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
