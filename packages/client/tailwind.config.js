const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
	container: {
		center: true,
	},
    extend: {},
  },
  plugins: [
	require('@tailwindcss/typography'),
	require('daisyui'),
  ],
  daisyui: {
	// themes: ['dracula'],
  },
//   darkMode: false,
};
