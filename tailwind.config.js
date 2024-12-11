import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
  },
  daisyui: {
    themes: [
      {
        'itbkk-light': {
          primary: '#f04c1c',
          secondary: '#e2e2e2',
          accent: '#00cdb7',
          neutral: '#fafafa',
          "base-100": "#efefef",
          "base-200": "#f8f8f8",
          'base-300': '#ffffff',
          'base-content': '#374151',
          info: '#00b5ff',
          success: '#00a96e',
          warning: '#ffbe00',
          error: '#ff5861'
        }
      },
      {
        'itbkk-dark': {
          primary: '#f04c1c',
          secondary: '#4D545D',
          accent: '#00cdb7',
          neutral: '#313842',
          'base-100': '#181E24',
          'base-200': '#1D232A',
          'base-300': '#232A32',
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
