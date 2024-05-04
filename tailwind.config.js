import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  daisyui: {
    themes: [
      {
        'itbkk-light': {
          primary: '#f04c1c',
          secondary: '#4b5563',
          accent: '#00cdb7',
          neutral: '#eeeeee',
          'base-100': '#ffffff',
          info: '#00b5ff',
          success: '#00a96e',
          warning: '#ffbe00',
          error: '#ff5861'
        }
      },
      {
        'itbkk-dark': {
          primary: '#f04c1c',
          secondary: '#4b5563',
          accent: '#00cdb7',
          neutral: '#2a323c',
          'base-100': '#1d232a',
          info: '#00b5ff',
          success: '#00a96e',
          warning: '#ffbe00',
          error: '#ff5861'
        }
      }
    ]
  },
  plugins: [daisyui]
}
