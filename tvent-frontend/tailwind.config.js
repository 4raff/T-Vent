/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "watercolor-sky": "hsl(200 60% 92%)",
        "watercolor-violet": "hsl(270 45% 90%)",
        "watercolor-rose": "hsl(350 60% 92%)",
        foreground: "#1f2937",
        muted: "#f3f4f6",
        primary: "#9333ea",
        secondary: "#ec4899",
        accent: "#e5e7eb",
      },
      boxShadow: {
        watercolor:
          "0 4px 20px hsla(200, 70%, 55%, 0.15), 0 0 40px hsla(270, 50%, 75%, 0.1)",
      },
      backgroundImage: {
        "gradient-hero":
          "linear-gradient(135deg, hsl(200 60% 92%), hsl(270 45% 90%), hsl(350 60% 92%))",
        "gradient-primary":
          "linear-gradient(135deg, hsl(200 70% 65%), hsl(220 65% 70%))",
        "gradient-secondary":
          "linear-gradient(135deg, hsl(270 50% 75%), hsl(290 55% 80%))",
      },
    },
  },
  plugins: [],
};
