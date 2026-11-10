import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  // Íconos: Phosphor (ph:*) para UI y Simple Icons (simple-icons:*) para marcas.
  integrations: [tailwind(), icon()]
});
