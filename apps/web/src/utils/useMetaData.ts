import { useEffect } from "react";

export function useMetaData(
	title: string,
	description: string,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	dependencyArray?: any,
) {
	useEffect(() => {
		// Set the document title
		document.title = title;

		// Create and set meta tags
		const metaDescription = document.createElement("meta");
		metaDescription.name = "description";
		metaDescription.content = description;
		document.head.appendChild(metaDescription);

		// Cleanup function to remove meta tags when the component unmounts
		return () => {
			document.head.removeChild(metaDescription);
		};
	}, [dependencyArray]);
}
