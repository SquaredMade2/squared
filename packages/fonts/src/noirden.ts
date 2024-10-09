type FontStyle = {
	fontFamily: string;
};

interface FontObject {
	style: FontStyle;
	variable: string;
	className?: string;
}

const fontConfig = {
	src: [
		{
			path: "/fonts/Noirden_Sans/TTF/Noirden-Thin.ttf",
			weight: "100",
			style: "normal",
		},
		{
			path: "/fonts/Noirden_Sans/TTF/Noirden-ThinOblique.ttf",
			weight: "100",
			style: "italic",
		},
		{
			path: "/fonts/Noirden_Sans/TTF/Noirden-ExtraLight.ttf",
			weight: "200",
			style: "normal",
		},
		{
			path: "/fonts/Noirden_Sans/TTF/Noirden-ExtraLightOblique.ttf",
			weight: "200",
			style: "italic",
		},
		{
			path: "/fonts/Noirden_Sans/TTF/Noirden-Light.ttf",
			weight: "300",
			style: "normal",
		},
		{
			path: "/fonts/Noirden_Sans/TTF/Noirden-LightOblique.ttf",
			weight: "300",
			style: "italic",
		},
		{
			path: "/fonts/Noirden_Sans/TTF/Noirden-Regular.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "/fonts/Noirden_Sans/TTF/Noirden-RegularOblique.ttf",
			weight: "400",
			style: "italic",
		},
		{
			path: "/fonts/Noirden_Sans/TTF/Noirden-SemiBold.ttf",
			weight: "600",
			style: "normal",
		},
		{
			path: "/fonts/Noirden_Sans/TTF/Noirden-SemiBoldOblique.ttf",
			weight: "600",
			style: "italic",
		},
		{
			path: "/fonts/Noirden_Sans/TTF/Noirden-Bold.ttf",
			weight: "700",
			style: "normal",
		},
		{
			path: "/fonts/Noirden_Sans/TTF/Noirden-BoldOblique.ttf",
			weight: "700",
			style: "italic",
		},
		{
			path: "/fonts/Noirden_Sans/TTF/Noirden-Bold.ttf",
			weight: "800",
			style: "normal",
		},
		{
			path: "/fonts/Noirden_Sans/TTF/Noirden-BoldOblique.ttf",
			weight: "800",
			style: "italic",
		},
		{
			path: "/fonts/Noirden_Sans/TTF/Noirden-Bold.ttf",
			weight: "900",
			style: "normal",
		},
		{
			path: "/fonts/Noirden_Sans/TTF/Noirden-BoldOblique.ttf",
			weight: "900",
			style: "italic",
		},
	],
	variable: "--font-noirden-sans",
};

export const noirdenSans = (): FontObject => {
	if (typeof window === "undefined") {
		return {
			style: { fontFamily: fontConfig.variable },
			variable: fontConfig.variable,
		};
	}

	const fontFaces = fontConfig.src.map(
		({ path, weight, style }) =>
			new FontFace("Noirden Sans", `url(${path})`, { weight, style }),
	);

	Promise.all(fontFaces.map((font) => font.load())).then((loadedFonts) => {
		for (const font of loadedFonts) {
			document.fonts.add(font);
		}
	});

	return {
		style: { fontFamily: "Noirden Sans, sans-serif" },
		variable: fontConfig.variable,
	};
};
