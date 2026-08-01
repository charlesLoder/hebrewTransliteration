import type { Config, Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const response = await context.next();

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("text/html")) {
    return response;
  }

  let html = await response.text();

  const theme = context.cookies.get("theme") || "system";
  html = html.replace("{{ USER_THEME }}", theme);

  return new Response(html, {
    status: response.status,
    headers: response.headers,
  });
};

export const config: Config = {
  path: "/*",
};
