"use client";

import { RetroColumn } from "@/components/Sprints";
import { toast } from "@/components/ui/use-toast";
import { sprintService } from "@/lib/services";
import { parseParams } from "@/utils/parseParams";
import { useUser } from "@clerk/nextjs";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { TODO } from "@squared/context";
import type { RetrospectiveItem, RetrospectiveItemType } from "@squared/db";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { type Socket, io } from "socket.io-client";

export type RetroItem = Pick<
	RetrospectiveItem,
	"id" | "content" | "type" | "authorId" | "likes"
>;

export default function SprintRetrospectivePage() {
	const params = useParams();
	const sprintId = parseParams(params.sprintId) ?? "";
	const { user } = useUser();
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
				if (user) {
					const response = await sprintService.addRetrospectiveItem(TODO, {
						sprintId,
						authorId: user.id,
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
				}
			} catch (error) {
				console.error("Error adding item:", error);
				toast({ title: "Failed to add item", variant: "destructive" });
			}
		},
		[sprintId, socket, sprintService],
	);

	const handleLikeItem = useCallback(
		async (itemId: string, userId: string) => {
			try {
				const response = await sprintService.likeRetrospectiveItem(TODO, {
					retrospectiveItemId: itemId,
					userId,
				});

				if (response) {
					socket?.emit("likeItem", { sprintId, itemId, userId });
					setData((prevData) => {
						const updatedData = Object.fromEntries(
							Object.entries(prevData).map(([key, items]) => [
								key as RetrospectiveItemType,
								items.map((item) => (item.id === itemId ? response : item)),
							]),
						) as Record<RetrospectiveItemType, RetroItem[]>;
						return updatedData;
					});
				}
			} catch (error) {
				console.error("Error liking item:", error);
				toast({ title: "Failed to like item", variant: "destructive" });
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
				<div className="flex h-screen w-full flex-col overflow-hidden">
					<div className="mb-4 w-full border-border border-b py-4">
						<h1 className="font-bold text-xl">Sprint Retrospective</h1>
					</div>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<RetroColumn
							title="What Went Well"
							type="wentWell"
							items={data.wentWell}
							onAddItem={handleAddItem}
							onLikeItem={handleLikeItem}
						/>
						<RetroColumn
							title="To Improve"
							type="toImprove"
							items={data.toImprove}
							onAddItem={handleAddItem}
							onLikeItem={handleLikeItem}
						/>
						<RetroColumn
							title="Action Items"
							type="actionItems"
							items={data.actionItems}
							onAddItem={handleAddItem}
							onLikeItem={handleLikeItem}
						/>
					</div>
				</div>
			</div>
		</DragDropContext>
	);
}
