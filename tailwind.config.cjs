/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{index,vue,js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), require('flowbite/plugin')],
}
