/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@spartan-ng/brain/hlm-tailwind-preset')],
  content: ['./src/**/*.{html,ts}', './libs/**/*.{html,ts}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
