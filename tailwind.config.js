/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "PingFang SC",
          "Microsoft YaHei",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      colors: {
        tiktok: {
          pink: "#fe2c55",
          cyan: "#20d5ec",
        },
      },
      boxShadow: {
        phone: "0 26px 80px rgba(0, 0, 0, 0.48), 0 0 0 9px #16161a",
      },
    },
  },
  plugins: [],
};
