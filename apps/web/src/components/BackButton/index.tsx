import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import ButtonIcon from "../ButtonIcon";

type Props = {
	callback?: () => void;
	hoverbackground?: string;
};

const BackButton = ({ callback, hoverbackground }: Props) => {
	const router = useRouter();

	const handleClick = () => {
		if (callback) {
			callback();
		} else {
			router.back();
		}
	};

	return (
		<ButtonIcon
			icon={<FontAwesomeIcon icon={faArrowLeft} />}
			handleClick={handleClick}
			hoverBg={hoverbackground}
		/>
	);
};

export default BackButton;
