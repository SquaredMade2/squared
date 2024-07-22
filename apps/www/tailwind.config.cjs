/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "radial-top":"radial-gradient(at top center, var(--tw-gradient-stops))",
      },
      screens: {

        xxxs:{max: "319px"},
        xxs:{min: "320px", max: "480px"},
        xs: { min: "481px", max: "767px" },
        sm: { min: "768px", max: "991px" },
        md: { min: "992px", max: "1199px" }, 
        lg: { min: "1200px", max: "1439px" },
        xl: { min: "1440px", max: "1599px" },
        xxl: { min: "1600px", max: "1919px" },
        xxxl: {min: "1920px"},
      },
      fontFamily :{
        "chivo": ["Chivo"],
        "chivoMono": ["Chivo Mono"],
      },
    },
  },
 

  plugins: [],
};
