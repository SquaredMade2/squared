import ButtonIcon from "../ButtonIcon";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hovercard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import Teams from "../Teams";
import { Label } from "@repo/ui/menu";
const TeamsButton = () => {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<button>
					<ButtonIcon
						icon={
							<FontAwesomeIcon
								className="text-gray-600 dark:text-gray-400"
								icon={faUsers}
							/>
						}
						hoverBg="bg-card"
					/>
				</button>
			</HoverCardTrigger>
			<HoverCardContent className="w-72" side="right">
				<div className="flex flex-col ap-2">
					<Label>Teams</Label>

					<Teams />
				</div>
			</HoverCardContent>
		</HoverCard>
	);
};
export default TeamsButton;
