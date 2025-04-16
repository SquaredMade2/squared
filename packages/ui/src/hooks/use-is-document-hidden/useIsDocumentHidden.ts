import { useEffect, useState } from "react";

/**
 * A hook that tracks whether the current document is hidden or visible
 *
 * This hook uses the Document Visibility API to monitor when a user navigates
 * away from the current tab or minimizes the browser. It updates state
 * whenever the document's visibility changes.
 */
export const useIsDocumentHidden = (): boolean => {
	// Initialize state with current document visibility
	const [isDocumentHidden, setIsDocumentHidden] = useState<boolean>(
		document.hidden,
	);

	useEffect(() => {
		/**
		 * Event handler that updates state when document visibility changes
		 */
		const handleVisibilityChange = () => {
			setIsDocumentHidden(document.hidden);
		};

		// Subscribe to visibility change events
		document.addEventListener("visibilitychange", handleVisibilityChange);

		// Clean up the event listener on component unmount
		return () =>
			document.removeEventListener("visibilitychange", handleVisibilityChange);
	}, []);

	return isDocumentHidden;
};
