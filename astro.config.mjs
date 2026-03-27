// @ts-check
import { defineConfig } from "astro/config";

import svelte from "@astrojs/svelte";

import tailwindcss from "@tailwindcss/vite";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      noExternal: [
        "@lucide/svelte",
        "bits-ui",
        "svelte-toolbelt",
        "runed",
        "svelte-codemirror-editor",
        "svelte-sonner",
      ],
    },
  },

  adapter: netlify(),
});
