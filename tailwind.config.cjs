/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontSize: {
        "2xs": ["0.6rem", "0.8rem"],
        "3xs": ["0.5rem", "0.65rem"],
      },
    },
  },
  plugins: [],
};
