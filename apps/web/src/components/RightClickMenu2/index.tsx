import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "../ui/context-menu";

const RightClickMenu2 = () => {
	return (
		<ContextMenu>
			<ContextMenuTrigger></ContextMenuTrigger>
			<ContextMenuContent className="">
				<ContextMenuItem inset>test</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
};

export default RightClickMenu2;
