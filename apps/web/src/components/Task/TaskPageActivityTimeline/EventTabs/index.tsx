import {
	Tabs,
	TabsHeader,
	TabsBody,
	Tab,
	TabPanel,
} from "@material-tailwind/react";
// import CommentForm from "@/components/Comments";
import ActivityItemContainer from "../ActivtyItemContainer";

const EventTabs = () => {
	return (
		<Tabs value="Activity">
			<TabsHeader
				className="bg-background pb-0 px-0"
				indicatorProps={{
					className:
						"bg-muted dark:bg-accent border-t border-x border-transparent rounded-none rounded-t-lg text-foreground mb-0 pb-0",
				}}
				placeholder={undefined}
				onPointerEnterCapture={undefined}
				onPointerLeaveCapture={undefined}
			>
				<Tab
					key="Activity"
					value="Activity"
					className="text-foreground border-t border-x border-transparent w-36 py-2 "
					placeholder={undefined}
					onPointerEnterCapture={undefined}
					onPointerLeaveCapture={undefined}
				>
					Activity
				</Tab>
				<Tab
					className="text-foreground border-t border-x border-transparent w-36 ml-2 py-2 "
					key="Comments"
					value="Comments"
					placeholder={undefined}
					onPointerEnterCapture={undefined}
					onPointerLeaveCapture={undefined}
				>
					Comments
				</Tab>
			</TabsHeader>
			<div className="w-full h-px bg-muted dark:bg-accent" />
			<TabsBody
				placeholder={undefined}
				onPointerEnterCapture={undefined}
				onPointerLeaveCapture={undefined}
			>
				<TabPanel key="Activity" value="Activity" className="px-0 py-6">
					<ActivityItemContainer />
				</TabPanel>
				<TabPanel key="Comment" value="Comments" className="px-0 py-6">
					{/* <CommentForm /> TODO: IMPLEMENT COMMENTS AGAIN */}
					<div />
				</TabPanel>
			</TabsBody>
		</Tabs>
	);
};

export default EventTabs;
