/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {backgroundImage: {
      'shadow-img': "url('http://localhost:3000/image-proxy?url=http://imgoss.cnu.cc/assets/images/shadow_img.png')",
    },},
  },
  plugins: [
    require('flowbite/plugin'),
    require('tailwind-scrollbar'),
  ],
};
