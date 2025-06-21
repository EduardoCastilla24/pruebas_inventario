import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";
import clerk from "@clerk/astro";
import { esES } from "@clerk/localizations";


export default defineConfig({
    integrations: [clerk({
        localization: esES,
    }  )],
    vite: {
      plugins: [tailwindcss()],
    },
    adapter: netlify(),
    output: 'server',
});