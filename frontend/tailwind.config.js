import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "light",
      {
        black: {
          "primary": "rgb(29, 155, 240)",
          "secondary": "rgb(24, 24, 24)",
          "base-100": "#000000",
          "base-200": "#0D0D0D",
          "base-300": "#1A1A1A",
          "base-content": "#ffffff",
          "neutral": "#272727",
        },
      },
    ],
  },
};