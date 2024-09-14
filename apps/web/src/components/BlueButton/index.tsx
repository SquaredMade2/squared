import type { Props } from "./interfaces";
import { Button } from "../ui/button";

const BlueButton: React.FunctionComponent<Props> = ({
	description,
	handleAction,
}) => {
	const handleClick = () => {
		if (handleAction) {
			handleAction();
		} else {
			return;
		}
	};

	return (
		<div>
			<Button onClick={handleClick} type="button">
				{description}
			</Button>
		</div>
	);
};

export default BlueButton;
