import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
    // baseUrl: 'http://localhost:4173'
    // baseUrl: 'http://localhost:5173'
    // baseUrl: 'http://ip23pl1.sit.kmutt.ac.th'
    baseUrl: "http://intproj23.sit.kmutt.ac.th/pl1",
  },

  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
