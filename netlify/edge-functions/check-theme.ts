import type { Config, Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const response = await context.next();

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("text/html")) {
    return response;
  }

  let html = await response.text();

  console.log(`1. cookie: ${context.cookies.get("theme")} `);
  console.log(`2. header: ${request.headers.get("sec-ch-prefers-color-scheme")}`);
  console.log(`3. mode: ${context.cookies.get("theme-mode")}`);

  const theme = context.cookies.get("theme") || request.headers.get("sec-ch-prefers-color-scheme");
  html = html.replace("{{ USER_THEME }}", theme || "");
  html = html.replace("{{ USER_THEME_MODE }}", context.cookies.get("theme-mode") || "system");

  return new Response(html, {
    status: response.status,
    headers: response.headers,
  });
};

export const config: Config = {
  path: "/*",
};
