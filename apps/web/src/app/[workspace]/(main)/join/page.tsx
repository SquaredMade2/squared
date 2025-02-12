import JoinWorkspace from "./JoinWorkspace";

export const metadata = {
	openGraph: {
		title: "Squared",
		description: "You've been invited to join Squared!",
		siteName: "Squred",
		images: [
			{
				url: "/logo.png",
				width: 800,
				height: 800,
				alt: "Squared Logo",
			},
			{
				url: "/logo.png",
				width: 1600,
				height: 1600,
				alt: "Squared Logo",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Squared",
		description: "You've been invited to join Squared",
		images: ["/logo.png"],
	},
};

export default function JoinWorkspacePage() {
	return <JoinWorkspace />;
}
