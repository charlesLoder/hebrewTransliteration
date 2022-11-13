import { Handler, HandlerEvent } from "@netlify/functions";
import { Text } from "hebrew-transliteration";

/**
 * the key is a new whiteSpaceAfter char (e.g. "\n"), and the values are the taamim
 */
interface WhiteSpaceMap {
  [k: string]: string[];
}

const addWhiteSpace = (regexs: { whiteSpace: string; taamim: string }[]) => (w) => {
  for (const { whiteSpace, taamim } of regexs) {
    const rgx = new RegExp(`[${taamim}]`, "u");
    if (rgx.test(w.text)) {
      w.whiteSpaceAfter = whiteSpace
        .replace(/\\n/g, "\n")
        .replace(/\\t/g, "\t")
        .replace(/\\r/g, "\r")
        .replace(/\\s/g, " ");
      return w;
    }
  }
  return w;
};

const handler: Handler = async (event: HandlerEvent, context) => {
  try {
    if (event.httpMethod !== "POST") throw new Error(`${event.httpMethod} Not Allowed`);
    if (!event.body) throw new Error("No event body");

    const body: { text: string; options: { key: string; value: string }[] } = JSON.parse(
      event.body
    );
    const text = new Text(body.text);
    const whiteSpaceMap = body.options
      .filter((o) => o.value)
      .reduce((a, c) => {
        // key is the hex number of a unicode char
        const { key, value } = c;

        if (a[value]) {
          const { [value]: chars, ...rest } = a;
          return {
            ...rest,
            [value]: [key, ...chars],
          };
        }

        return {
          ...a,
          [value]: [key],
        };
      }, {} as WhiteSpaceMap);

    /** each key is the whiteSpaceAfter char, and the val is the array of unciode chars */
    const whiteSpaceArr = Object.entries(whiteSpaceMap).map(([key, value]) => ({ key, value }));
    const regexes = whiteSpaceArr.map((e) => ({
      whiteSpace: e.key,
      taamim: e.value.map((u) => `\\u{${u}}`).join(""),
    }));

    const result = text.words.map(addWhiteSpace(regexes)).reduce((s, w, i, arr) => {
      const next = arr[i + 1];
      if (next) {
        /**
         * if there is a pitucha or stuma marker,
         * then take whatever character appeared after the sof pasqud
         * and assign it to the marker.
         *
         * This is not a great way of doing it since we are modifying the data
         *
         * But it works for now
         */
        const nextPituchaOrStuma = /^[פ|ס]$/.test(next.text);
        if (nextPituchaOrStuma) {
          next.whiteSpaceAfter = w.whiteSpaceAfter;
          return s + `${w.text} `;
        }
        return s + `${w.text}${w.whiteSpaceAfter}`;
      }
      return s + `${w.text}${w.whiteSpaceAfter}`;
    }, "");

    const response = { text: result };

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
