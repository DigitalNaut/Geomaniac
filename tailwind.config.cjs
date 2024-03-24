/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx,css}", "./public/*.html"],
  theme: {
    extend: {
      keyframes: {
        scrollDash: {
          "to": { strokeDashoffset: "0" },
        },
      },
      backgroundImage: {
        "custom-unknown-flag": "url('src/assets/images/unknown-flag.min.svg')",
      },
    },
    screens: {
      xs: "360px",
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    fontFamily: {
      paytone: ["Paytone One", "sans-serif"],
    },
  },
  plugins: [require("@tailwindcss/line-clamp"), require("@tailwindcss/typography"), require("tailwind-scrollbar")],
};
