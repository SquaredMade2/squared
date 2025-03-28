import { VisuallyHidden } from "@squared/ui/visually-hidden";

export default { title: "Layout/VisuallyHidden" };

export const Basic = () => (
	<button>
		<VisuallyHidden>Save the file</VisuallyHidden>
		<span aria-hidden>💾</span>
	</button>
);
