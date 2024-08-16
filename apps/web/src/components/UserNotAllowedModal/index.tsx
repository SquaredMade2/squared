import { ClickAwayListener } from "@mui/base";
import type { UserNotAllowedModalProps } from "@/components/UserNotAllowedModal/UserNotAllowedModal.interfaces";

const UserNotAllowedModal = ({
	handleShowDropdown,
}: UserNotAllowedModalProps) => {
	return (
		<ClickAwayListener onClickAway={() => handleShowDropdown()}>
			<div
				className="border-red-500 border absolute z-10 top-1 right-8 flex px-4 py-2 rounded-lg bg-card"
				onClick={() => handleShowDropdown()}
			>
				<p className="text-center text-sm text-foreground font-medium">
					Edit/delete by author only
				</p>
			</div>
		</ClickAwayListener>
	);
};

export default UserNotAllowedModal;
