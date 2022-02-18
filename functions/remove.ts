import { Handler, HandlerEvent } from "@netlify/functions";
import { remove } from "hebrew-transliteration";

type RemoveOptions = {
  removeVowels: boolean;
  removeShinDot: boolean;
  removeSinDot: boolean;
};

const handler: Handler = async (event: HandlerEvent, context) => {
  try {
    if (event.httpMethod !== "POST") {
      throw await Promise.reject({
        message: `${event.httpMethod} Not Allowed`,
      });
    }
    const body: { text: string; options: RemoveOptions } = JSON.parse(event.body);
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
