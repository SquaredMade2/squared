"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { CreatedByInformation } from ".";

export const EventTabs = () => {
	return (
		<Tabs defaultValue="activity" className="w-full mt-8">
			<TabsList className="grid w-1/2 grid-cols-2 bg-transparent">
				<TabsTrigger value="activity">Activity</TabsTrigger>
				<TabsTrigger value="comments">Comments</TabsTrigger>
			</TabsList>
			<TabsContent value="activity">
				<div className="flex flex-col bg-card rounded-md text-sm">
					{/* <CreatedByInformation /> */}
					{/* <UpdatedByInformation /> */}
					<div>Task Events will be implemented here</div>
				</div>
			</TabsContent>
			<TabsContent value="comments">
				{/* TODO: Implement CommentForm component */}
				<div>Comments will be implemented here</div>
			</TabsContent>
		</Tabs>
	);
};
