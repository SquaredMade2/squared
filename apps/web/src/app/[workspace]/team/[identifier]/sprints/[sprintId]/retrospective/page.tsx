"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
	DragDropContext,
	Droppable,
	Draggable,
	type DropResult,
} from "@hello-pangea/dnd";
import { io, type Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import type { RetrospectiveItem } from "@repo/db";
import { useTeamStore } from "@/store";
import { parseParams } from "@/utils/parseParams";

type ColumnType = "wentWell" | "toImprove" | "actionItems";

interface ColumnProps {
	title: string;
	type: ColumnType;
	items: RetrospectiveItem[];
	onAddItem: (type: ColumnType, content: string) => void;
}

interface ItemMovedEvent {
	itemId: string;
	sourceType: ColumnType;
	destinationType: ColumnType;
	sourceIndex: number;
	destinationIndex: number;
}

const Column: React.FC<ColumnProps> = ({ title, type, items, onAddItem }) => {
	const [newItemContent, setNewItemContent] = useState("");

	const handleAddItem = () => {
		if (newItemContent.trim()) {
			onAddItem(type, newItemContent.trim());
			setNewItemContent("");
		}
	};

	return (
		<div className="bg-secondary p-4 rounded-lg">
			<h3 className="text-lg font-semibold mb-4">{title}</h3>
			<Droppable droppableId={type}>
				{(provided) => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{items.map((item, index) => (
							<Draggable key={item.id} draggableId={item.id} index={index}>
								{(provided) => (
									<div
										ref={provided.innerRef}
										{...provided.draggableProps}
										{...provided.dragHandleProps}
									>
										<Card className="mb-2">
											<CardContent className="p-2">{item.content}</CardContent>
										</Card>
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
			<div className="mt-4">
				<Input
					value={newItemContent}
					onChange={(e) => setNewItemContent(e.target.value)}
					placeholder="Add new item"
					className="mb-2"
				/>
				<Button onClick={handleAddItem}>Add</Button>
			</div>
		</div>
	);
};

export default function SprintRetrospectivePage() {
	const params = useParams();
	const {
		addRetrospectiveItem,
		updateRetrospectiveItemType,
		getRetrospectiveItems,
	} = useTeamStore((state) => state);
	const sprintId = parseParams(params.sprintId);
	const [data, setData] = useState<Record<ColumnType, RetrospectiveItem[]>>({
		wentWell: [],
		toImprove: [],
		actionItems: [],
	});
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const newSocket = io(process.env.NEXT_PUBLIC_URL || "");
		setSocket(newSocket);

		newSocket.emit("joinRoom", sprintId);

		newSocket.on("itemAdded", (newItem: RetrospectiveItem) => {
			setData((prevData) => ({
				...prevData,
				[newItem.type]: [...prevData[newItem.type as ColumnType], newItem],
			}));
		});

		newSocket.on(
			"itemMoved",
			({
				sourceType,
				destinationType,
				sourceIndex,
				destinationIndex,
			}: ItemMovedEvent) => {
				setData((prevData) => {
					const newData = { ...prevData };
					const [movedItem] = newData[sourceType].splice(sourceIndex, 1);
					if (movedItem) {
						movedItem.type = destinationType;
						newData[destinationType].splice(destinationIndex, 0, movedItem);
					}
					return newData;
				});
			},
		);

		return () => {
			newSocket.disconnect();
		};
	}, [sprintId]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getRetrospectiveItems(sprintId);
				setData(response);
			} catch (error) {
				console.error("Error fetching data:", error);
				toast({
					title: "Failed to load retrospective data",
					variant: "destructive",
				});
			}
		};

		fetchData();
	}, [sprintId, getRetrospectiveItems]);

	const handleAddItem = useCallback(
		async (type: ColumnType, content: string) => {
			try {
				const response = await addRetrospectiveItem(sprintId, type, content);
				const { item: newItem, message: title, variant } = response;
				if (newItem) {
					socket?.emit("addItem", { sprintId, ...newItem });
					setData((prevData) => ({
						...prevData,
						[type]: [...prevData[type], newItem],
					}));
				}
				toast({ title, variant });
			} catch (error) {
				console.error("Error adding item:", error);
				toast({ title: "Failed to add item", variant: "destructive" });
			}
		},
		[sprintId, socket, addRetrospectiveItem],
	);

	const onDragEnd = useCallback(
		async (result: DropResult) => {
			if (!result.destination) return;

			const sourceType = result.source.droppableId as ColumnType;
			const destinationType = result.destination.droppableId as ColumnType;
			const sourceIndex = result.source.index;
			const destinationIndex = result.destination.index;

			if (sourceType === destinationType && sourceIndex === destinationIndex)
				return;

			const itemId = result.draggableId;

			try {
				const response = await updateRetrospectiveItemType(
					sprintId,
					itemId,
					destinationType,
				);
				if (!response.item) {
					toast({ title: response.message, variant: response.variant });
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
		[sprintId, socket, updateRetrospectiveItemType],
	);

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className="container mx-auto py-10">
				<Card className="w-full">
					<CardHeader>
						<CardTitle>Sprint Retrospective</CardTitle>
						<CardDescription>
							Drag and drop items between columns to organize your retrospective
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<Column
								title="What Went Well"
								type="wentWell"
								items={data.wentWell}
								onAddItem={handleAddItem}
							/>
							<Column
								title="To Improve"
								type="toImprove"
								items={data.toImprove}
								onAddItem={handleAddItem}
							/>
							<Column
								title="Action Items"
								type="actionItems"
								items={data.actionItems}
								onAddItem={handleAddItem}
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</DragDropContext>
	);
}
