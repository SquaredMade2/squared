import { JetBrains_Mono } from "next/font/google";
import type { RenderLeafProps } from "slate-react";

const jetBrains = JetBrains_Mono({
	weight: "400",
	subsets: ["latin"],
});

const CodeLeaf = ({ attributes, children }: RenderLeafProps) => {
	return (
		<div className="w-full bg-muted">
			<code className={` ${jetBrains.className}`} {...attributes}>
				{children}
			</code>
		</div>
	);
};

export default CodeLeaf;
