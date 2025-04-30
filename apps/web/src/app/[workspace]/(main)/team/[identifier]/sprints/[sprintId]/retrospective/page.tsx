"use client";

import { RetroColumn } from "@/components/Sprints";
import { client } from "@/lib/client";
import { parseError } from "@/utils/parseError";
import { parseParams } from "@/utils/parseParams";
import { useUser } from "@clerk/nextjs";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import type { RetrospectiveItem, RetrospectiveItemType } from "@squaredmade/db";
import { Button } from "@squaredmade/ui/button";
import { toast } from "@squaredmade/ui/toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { type Socket, io } from "socket.io-client";

export type RetroItem = Pick<
	RetrospectiveItem,
	"id" | "content" | "type" | "authorId" | "likes" | "createdAt"
>;

export default function SprintRetrospectivePage() {
	const router = useRouter();
	const params = useParams();
	const sprintId = parseParams(params.sprintId) ?? "";
	const [socket, setSocket] = useState<Socket | null>(null);
	const { user } = useUser();

	const { identifier, workspace } = params;

	const {
		data = { actionItems: [], toImprove: [], wentWell: [], likedItems: [] },
		refetch: fetchData,
	} = useQuery({
		queryKey: ["sprint", "retrospective", sprintId],
		queryFn: async () => {
			try {
				const response = await client.sprint.getRetro
					.$get({
						sprintId,
					})
					.then((res) => res.json());

				const likedItems = [
					...response.actionItems.filter((item) =>
						item.likes.includes(user?.id ?? ""),
					),
					...response.toImprove.filter((item) =>
						item.likes.includes(user?.id ?? ""),
					),
					...response.wentWell.filter((item) =>
						item.likes.includes(user?.id ?? ""),
					),
				].map((item) => item.id);

				return { ...response, likedItems };
			} catch (error) {
				toast.error("Failed to load retrospective data", {
					description: parseError(error),
				});
				return { actionItems: [], toImprove: [], wentWell: [], likedItems: [] };
			}
		},
	});

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
			toast.error("Connection error", {
				description:
					"Unable to connect to the server. Please try refreshing the page.",
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

		newSocket.on("itemLiked", () => {
			fetchData();
		});

		setSocket(newSocket);

		fetchData();

		return () => {
			newSocket.disconnect();
		};
	}, [sprintId, fetchData]);

	const { mutate: handleAddItem } = useMutation({
		mutationKey: ["sprint", "retrospective", sprintId],
		mutationFn: async ({
			type,
			content,
		}: { type: RetrospectiveItemType; content: string }) => {
			return await client.sprint.addRetroItem
				.$post({
					sprintId,
					type,
					content,
				})
				.then((res) => res.json());
		},
		onError: (error) => {
			toast.error("Failed to add item", {
				description: parseError(error),
			});
		},
		onSuccess: (response) => {
			socket?.emit("addItem", { sprintId, ...response });
			fetchData();
			toast.success("Item added successfully");
		},
	});
	const { mutate: handleLikeItem } = useMutation({
		mutationKey: ["sprint", "retrospective", sprintId],
		mutationFn: async (itemId: string) => {
			return await client.sprint.likeRetroItem
				.$post({
					retroItemId: itemId,
				})
				.then((res) => res.json());
		},
		onError: (error) => {
			toast.error("Failed to like item", {
				description: parseError(error),
			});
		},
		onSuccess: (response) => {
			socket?.emit("itemLiked", {
				sprintId,
				itemId: response.id,
				userId: response.authorId,
			});
			fetchData();
		},
	});

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
				const response = await client.sprint.updateRetroItemType.$post({
					sprintId,
					retrospectiveItemId: itemId,
					type: destinationType,
				});
				if (!response) {
					toast.error("There was an issue updating your item");
					return;
				}

				fetchData();

				socket?.emit("moveItem", {
					sprintId,
					itemId,
					sourceType,
					destinationType,
					sourceIndex,
					destinationIndex,
				});

				toast.success("Item moved successfully");
			} catch (error) {
				console.error("Error moving item:", error);
				toast.error("Failed to move item");
			}
		},
		[sprintId, socket],
	);

	const handleReturn = () => {
		router.push(`/${workspace}/team/${identifier}/sprints/${sprintId}`);
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className="container mx-auto py-10">
				<div className="flex h-screen w-full flex-col overflow-hidden">
					<div className="mb-4 w-full border-border border-b py-4">
						<Button className="mb-5 w-1/6" onClick={handleReturn}>
							Return
						</Button>
						<h1 className="font-bold text-xl">Sprint Retrospective</h1>
					</div>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<RetroColumn
							title="What Went Well"
							type="wentWell"
							items={data.wentWell}
							onAddItem={(type, content) => handleAddItem({ type, content })}
							onLikeItem={(itemId) => handleLikeItem(itemId)}
							likedItems={data.likedItems}
						/>
						<RetroColumn
							title="To Improve"
							type="toImprove"
							items={data.toImprove}
							onAddItem={(type, content) => handleAddItem({ type, content })}
							onLikeItem={(itemId) => handleLikeItem(itemId)}
							likedItems={data.likedItems}
						/>
						<RetroColumn
							title="Action Items"
							type="actionItems"
							items={data.actionItems}
							onAddItem={(type, content) => handleAddItem({ type, content })}
							onLikeItem={(itemId) => handleLikeItem(itemId)}
							likedItems={data.likedItems}
						/>
					</div>
				</div>
			</div>
		</DragDropContext>
	);
}
