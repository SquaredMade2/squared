"use client";

import { RetroColumn } from "@/components/Sprints";
import { toast } from "@/components/ui/use-toast";
import { sprintService } from "@/lib/services";
import { parseParams } from "@/utils/parseParams";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { TODO } from "@squared/context";
import type { RetrospectiveItem, RetrospectiveItemType } from "@squared/db";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { type Socket, io } from "socket.io-client";

type RetroItem = Pick<RetrospectiveItem, "id" | "content" | "type" | "upvotes">;

export default function SprintRetrospectivePage() {
	const params = useParams();
	const sprintId = parseParams(params.sprintId);
	const [data, setData] = useState<Record<RetrospectiveItemType, RetroItem[]>>({
		wentWell: [],
		toImprove: [],
		actionItems: [],
	});
	const [socket, setSocket] = useState<Socket | null>(null);

	const fetchData = useCallback(async () => {
		try {
			const response = await sprintService.getRetrospectiveItems(TODO, {
				sprintId,
			});
			setData(response);
		} catch (error) {
			console.error("Error fetching data:", error);
			toast({
				title: "Failed to load retrospective data",
				variant: "destructive",
			});
		}
	}, [sprintId, sprintService]);

	useEffect(() => {
		const socketUrl = process.env.NEXT_PUBLIC_SERVER || "http://localhost:5173";

		const newSocket = io(socketUrl, {
			transports: ["websocket"],
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
			timeout: 10000,
		});

		newSocket.on("connect", () => {
			newSocket.emit("joinRoom", sprintId);
		});

		newSocket.on("connect_error", (error) => {
			console.error("Socket.IO connection error:", error);
			toast({
				title: "Connection error",
				description:
					"Unable to connect to the server. Please try refreshing the page.",
				variant: "destructive",
			});
		});

		newSocket.on("disconnect", (reason) => {
			console.log("Disconnected from Socket.IO server:", reason);
		});

		newSocket.on("itemAdded", () => {
			fetchData();
		});

		newSocket.on("itemMoved", () => {
			fetchData();
		});

		setSocket(newSocket);

		fetchData();

		return () => {
			newSocket.disconnect();
		};
	}, [sprintId, fetchData]);

	const handleAddItem = useCallback(
		async (type: RetrospectiveItemType, content: string) => {
			try {
				const response = await sprintService.addRetrospectiveItem(TODO, {
					sprintId,
					type,
					content,
				});
				if (response) {
					socket?.emit("addItem", { sprintId, ...response });
					setData((prevData) => ({
						...prevData,
						[type]: [...prevData[type], response],
					}));
				}
				toast({ title: "Item added successfully" });
			} catch (error) {
				console.error("Error adding item:", error);
				toast({ title: "Failed to add item", variant: "destructive" });
			}
		},
		[sprintId, socket, sprintService],
	);

	const handleUpvoteItem = useCallback(
		async (itemId: string, type: RetrospectiveItemType) => {
			try {
				const updatedItem =
					await sprintService.incrementRetrospectiveItemUpvotes(TODO, {
						itemId,
					});
				if (updatedItem) {
					socket?.emit("upvoteItem", { sprintId, ...updatedItem });
					setData((prevData) => ({
						...prevData,
						[type]: prevData[type].map((item) =>
							item.id === updatedItem.id ? updatedItem : item,
						),
					}));
				}
			} catch (error) {
				console.error("Error upvoting item:", error);
				toast({ title: "Failed to upvote item", variant: "destructive" });
			}
		},
		[sprintId, socket, sprintService],
	);

	const onDragEnd = useCallback(
		async (result: DropResult) => {
			if (!result.destination) return;

			const sourceType = result.source.droppableId as RetrospectiveItemType;
			const destinationType = result.destination
				.droppableId as RetrospectiveItemType;
			const sourceIndex = result.source.index;
			const destinationIndex = result.destination.index;

			if (sourceType === destinationType && sourceIndex === destinationIndex)
				return;

			const itemId = result.draggableId;

			try {
				const response = await sprintService.updateRetrospectiveItem(TODO, {
					sprintId,
					retrospectiveItemId: itemId,
					type: destinationType,
					content: "",
				});
				if (!response) {
					toast({
						title: "There was an issue updating your item",
						variant: "destructive",
					});
					return;
				}

				setData((prevData) => {
					const newData = { ...prevData };
					const [movedItem] = newData[sourceType].splice(sourceIndex, 1);
					if (movedItem) {
						movedItem.type = destinationType;
						newData[destinationType].splice(destinationIndex, 0, movedItem);
					}
					return newData;
				});

				socket?.emit("moveItem", {
					sprintId,
					itemId,
					sourceType,
					destinationType,
					sourceIndex,
					destinationIndex,
				});

				toast({ title: "Item moved successfully", variant: "default" });
			} catch (error) {
				console.error("Error moving item:", error);
				toast({ title: "Failed to move item", variant: "destructive" });
			}
		},
		[sprintId, socket, sprintService],
	);

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className="container mx-auto py-10">
				<div className="w-full flex flex-col h-screen overflow-hidden">
					<div className="mb-4 py-4 border-b border-border w-full">
						<h1 className="text-xl font-bold">Sprint Retrospective</h1>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<RetroColumn
							title="What Went Well"
							type="wentWell"
							items={data.wentWell}
							onAddItem={handleAddItem}
							onUpvoteItem={handleUpvoteItem}
						/>
						<RetroColumn
							title="To Improve"
							type="toImprove"
							items={data.toImprove}
							onAddItem={handleAddItem}
							onUpvoteItem={handleUpvoteItem}
						/>
						<RetroColumn
							title="Action Items"
							type="actionItems"
							items={data.actionItems}
							onAddItem={handleAddItem}
							onUpvoteItem={handleUpvoteItem}
						/>
					</div>
				</div>
			</div>
		</DragDropContext>
	);
}
