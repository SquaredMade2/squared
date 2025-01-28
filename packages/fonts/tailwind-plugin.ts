import plugin from "tailwindcss/plugin";

export default plugin(
	({ addBase }) => {
		addBase({
			body: { fontFamily: "NoirdenSans, sans-serif" },
		});
	},
	{
		theme: {
			extend: {
				fontFamily: {
					sans: ["NoirdenSans", "sans-serif"],
					noirden: ["NoirdenSans", "sans-serif"],
				},
			},
		},
	},
);
