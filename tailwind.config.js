import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'or2-base-100': '#f4f4f4',
        'or2-base-200': '#ececec',
        'or2-base-300': '#fafafa',
        'or2-base-content': '#374151',
      }
    }
  },
  daisyui: {
    themes: [
      {
        'itbkk-light': {
          primary: '#f04c1c',
          secondary: '#4b5563',
          accent: '#00cdb7',
          neutral: '#fafafa',
          "base-100": "#ececec",
          "base-200": "#f4f4f4",
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
          secondary: '#4b5563',
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
