import localFont from "next/font/local";

export const noirdenSans = localFont({
	src: [
		{
			path: "../../public/fonts/Noirden_Sans/TTF/Noirden-Thin.ttf",
			weight: "100",
			style: "normal",
		},
		{
			path: "../../public/fonts/Noirden_Sans/TTF/Noirden-ThinOblique.ttf",
			weight: "100",
			style: "italic",
		},
		{
			path: "../../public/fonts/Noirden_Sans/TTF/Noirden-ExtraLight.ttf",
			weight: "200",
			style: "normal",
		},
		{
			path: "../../public/fonts/Noirden_Sans/TTF/Noirden-ExtraLightOblique.ttf",
			weight: "200",
			style: "italic",
		},
		{
			path: "../../public/fonts/Noirden_Sans/TTF/Noirden-Light.ttf",
			weight: "300",
			style: "normal",
		},
		{
			path: "../../public/fonts/Noirden_Sans/TTF/Noirden-LightOblique.ttf",
			weight: "300",
			style: "italic",
		},
		{
			path: "../../public/fonts/Noirden_Sans/TTF/Noirden-Regular.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../public/fonts/Noirden_Sans/TTF/Noirden-RegularOblique.ttf",
			weight: "400",
			style: "italic",
		},
		{
			path: "../../public/fonts/Noirden_Sans/TTF/Noirden-SemiBold.ttf",
			weight: "600",
			style: "normal",
		},
		{
			path: "../../public/fonts/Noirden_Sans/TTF/Noirden-SemiBoldOblique.ttf",
			weight: "600",
			style: "italic",
		},
		{
			path: "../../public/fonts/Noirden_Sans/TTF/Noirden-Bold.ttf",
			weight: "700",
			style: "normal",
		},
		{
			path: "../../public/fonts/Noirden_Sans/TTF/Noirden-BoldOblique.ttf",
			weight: "700",
			style: "italic",
		},
		// Note: Noirden Sans doesn't seem to have an 800 (ExtraBold) weight,
		// so we'll use Bold for 800 as well
		{
			path: "../../public/fonts/Noirden_Sans/TTF/Noirden-Bold.ttf",
			weight: "800",
			style: "normal",
		},
		{
			path: "../../public/fonts/Noirden_Sans/TTF/Noirden-BoldOblique.ttf",
			weight: "800",
			style: "italic",
		},
		// Note: Noirden Sans doesn't seem to have a 900 (Black) weight,
		// so we'll use Bold for 900 as well
		{
			path: "../../public/fonts/Noirden_Sans/TTF/Noirden-Bold.ttf",
			weight: "900",
			style: "normal",
		},
		{
			path: "../../public/fonts/Noirden_Sans/TTF/Noirden-BoldOblique.ttf",
			weight: "900",
			style: "italic",
		},
	],
	variable: "--font-noirden-sans",
});
