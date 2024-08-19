import type { PurpleToggleProps } from "./interfaces.PurpleToggle";

const PurpleToggle = ({ active, handleClick }: PurpleToggleProps) => {
	return (
		<div
			className={`${active ? "h-5 w-8 bg-cyan-500 rounded-xl relative flex items-center cursor-pointer transition-colors duration-200" : "h-5 w-8 bg-pink-500 rounded-xl relative flex items-center cursor-pointer transition-colors duration-200"}`}
			onClick={handleClick}
		>
			<div
				className={`${"bg-white h-3.5 w-3.5 rounded-full absolute transition-transform duration-200 m-1"} ${
					active ? "translate-x-[calc(100%-0.25rem)]" : "translate-x-0"
				}`}
			/>
		</div>
	);
};

export default PurpleToggle;
