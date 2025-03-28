import { useLayoutEffect } from "@squaredmade/ui/use-layout-effect";
import * as React from "react";

// We spaces with `.trim().toString()` to prevent bundlers from trying to `import { useId } from 'react';`
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Typescript doesn't like to index React using a string so we have to say it's any
const useReactId =
	(React as any)[" useId ".trim().toString()] || (() => undefined);
let count = 0;

function useId(deterministicId?: string): string {
	const [id, setId] = React.useState<string | undefined>(useReactId());
	// React versions older than 18 will have client-side ids only.
	useLayoutEffect(() => {
		if (!deterministicId) {
			setId((reactId) => reactId ?? String(count++));
		}
	}, [deterministicId]);
	return deterministicId || (id ? `squared-${id}` : "");
}

export { useId };
