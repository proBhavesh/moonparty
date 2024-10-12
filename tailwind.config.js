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
				"primary-blue": "#571CFF",
				"light-blue": "#756BFF",
				"dark-blue": "#4813E0",
				"primary-pink": "#FF0057",
			},
			fontFamily: {
				"reem-kufi-fun": ["Reem Kufi Fun", "sans-serif"],
			},
		},
	},
	plugins: [],
};
