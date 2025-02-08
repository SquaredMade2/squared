import TokenVerification from "./TokenVerification";

export const metadata = {
	openGraph: {
		title: "Squared",
		description: "You've been invited to join Squared!",
		siteName: "Sqaured",
		images: [
			{
				url: "/logo.png",
				width: 800,
				height: 600,
				alt: "Squared Logo",
			},
			{
				url: "/logo.png",
				width: 1800,
				height: 1600,
				alt: "Squared Logo",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Squred",
		description: "You've been invited to join Squared!",
		images: ["/logo.png"],
	},
};

export const TokenVerificationPage = () => {
	return TokenVerification;
};
