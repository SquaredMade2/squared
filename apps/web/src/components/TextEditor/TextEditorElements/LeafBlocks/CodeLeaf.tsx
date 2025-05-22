import { JetBrains_Mono } from "next/font/google";
import type { RenderLeafProps } from "slate-react";

const jetBrains = JetBrains_Mono({
	weight: "400",
	subsets: ["latin"],
});

const CodeLeaf = (props: RenderLeafProps) => {
	return (
		<div className="w-full bg-muted">
			<code className={` ${jetBrains.className}`} {...props.attributes}>
				{props.children}
			</code>
		</div>
	);
};

export default CodeLeaf;
