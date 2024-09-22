import { CircleHelp } from "lucide-react";

const HelpButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button
			onClick={onClick}
			aria-label="Help about effort estimation"
			type="button"
		>
			{" "}
			<span className="w-2 h-2 cursor-pointer">
				<CircleHelp className="size-4 fill-muted text-muted-foreground" />
			</span>
		</button>
	);
};

export default HelpButton;
