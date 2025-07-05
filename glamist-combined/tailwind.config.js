/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // Updated to include index.html
  theme: {
    extend: {
      colors: {
        "salon-purple-dark": "#4C1D95", // Deep purple for sidebar
        "salon-purple": "#7C3AED", // Vibrant purple for accents
        "salon-purple-light": "#A78BFA", // Lighter purple for hover effects
        "salon-bg": "#F5F3FF", // Very light purple background
        "salon-gradient-start": "#6D28D9", // Gradient start
        "salon-gradient-end": "#A78BFA", // Gradient end
      },
      backgroundImage: {
        "salon-gradient": "linear-gradient(135deg, #6D28D9, #A78BFA)", // Custom gradient
      },
    },
  },
  plugins: [],
};
