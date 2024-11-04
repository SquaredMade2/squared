import type * as React from "react";
const TodoIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => (
	<svg
		xmlnsXlink="http://www.w3.org/1999/xlink"
		xmlns="http://www.w3.org/2000/svg"
		width={24}
		height={24}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		className="lucide lucide-circle size-4"
	>
		<title>Todo Icon</title>
		<circle
			cx={12}
			cy={12}
			r={10}
			stroke="#fff"
			fill="none"
			strokeWidth="2px"
		/>
	</svg>
);
export default TodoIcon;
