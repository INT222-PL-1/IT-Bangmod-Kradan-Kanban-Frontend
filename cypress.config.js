import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    // baseUrl: 'http://localhost:4173'
    baseUrl: 'http://ip23pl1.sit.kmutt.ac.th:3000'
  }
})
