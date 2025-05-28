// tailwind.config.js
module.exports = {
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"], // éviter les thèmes fancy avec oklch
  },
};
