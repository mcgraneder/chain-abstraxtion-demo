import defaultTheme from "tailwindcss/defaultTheme";

const tailwindConfig = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      animation: {
        blink: "pusle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        widthi: "widthin 1s forwards",
        widtho: "widthout 1s backwards",
      },
      keyframes: {
        pusle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        widthin: {
          "0%": { left: "150%" },
          "100%": { left: "0%" },
        },
        widthout: {
          "0%": { left: "0%" },
          "100%": { left: "150%" },
        },
      },
      transitionProperty: {
        width: "width",
      },
      colors: {
        primary: "#1fc7d4",
        secondary: "#00f6ff",
        dimWhite: "rgba(255, 255, 255, 0.7)",
        dimBlue: "rgba(9, 151, 124, 0.1)",
        tertiary: "rgb(60, 65, 80)",
        // secondary: "rgb(36,39,54)",
        lightTertiary: "rgb(66, 87, 122)",
        darkBackground: "rgb(13, 17, 28)",
        hoverLightground: "rgb(20, 24, 35)",

        extraDarkBackground: "rgb(13, 17, 28)",
        secondaryButtonColor: "rgb(28,44,81)",
        backgroundSecondaryLight: "rgb(74, 107, 161)",
        homeButton: "rgb(105, 95, 215)",
      },
      spacing: {
        "630px": "630px",
        "550px": "550px",
      },
      boxShadow: {
        custom: "0 0px 15px rgba(0, 0, 0, 0.01)",
      },
      screens: {
        sm2: "600px",
        md2: "780px",
        md: "935px",
        md1: "1000px",
        xs: "400px",
        mlg1: "1170px",
        mlg: "1250px",
      },
      borderRadius: {
        "32px": "32px",
      },
    },
  },
  safelist: ["bg-warning", "bg-error", "text-warning", "text-error"],
  plugins: [],
};

export default tailwindConfig;
