/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          primary: {
            light: colors.gray[50],
            dark: colors.gray[900]
          },
          secondary: {
            light: colors.gray[100],
            dark: colors.gray[800]
          }
        },
        content: {
          primary: {
            light: colors.gray[900],
            dark: colors.white
          }
        },
        border: {
          primary: {
            light: colors.gray[300],
            dark: colors.gray[700]
          }
        },
        accent: {
          primary: "#007a99", //"#367c39", // #2563eb
          secondary: "#008fb3", // #f97316
          tertiary: colors.yellow[500], // #eab308
          error: "#b32400", //colors.red[500]
        },
        status: {
          success: {
            bg: {
              light: colors.green[50],
              dark: colors.green[900]
            },
            text: {
              light: colors.green[700],
              dark: colors.green[100]
            }
          },
          error: {
            bg: {
              light: colors.red[50],
              dark: colors.red[900]
            },
            text: {
              light: colors.red[700],
              dark: colors.red[100]
            }
          },
          warning: {
            bg: {
              light: colors.yellow[50],
              dark: colors.yellow[900]
            },
            text: {
              light: colors.yellow[700],
              dark: colors.yellow[100]
            }
          },
          info: {
            bg: {
              light: colors.blue[50],
              dark: colors.blue[900]
            },
            text: {
              light: colors.blue[700],
              dark: colors.blue[100]
            }
          }
        }
      }
    },
  },
  plugins: [],
}
