import React from "react";
import ProfileImage from "@/components/ProfileImage";
import { parseISO } from "date-fns/parseISO";
import { formatDate } from "date-fns/format";
import { EventType } from "@/interfaces/event.interfaces";
import type { TaskEvent } from "@repo/db";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useActivityStore } from "@/storeZ";
import type { ActivityType } from "@/storeZ/activities";

const UpdatedByInformation = () => {
	const eventLogs = useActivityStore((state) => state.events);

	const findLabelAdded = (
		originalLabels: string[],
		updatedLabels: string[],
	) => {
		const labelName = updatedLabels.filter(
			(label) => !originalLabels.includes(label),
		);
		return labelName;
	};

	const findLabelRemoved = (
		originalLabels: string[],
		updatedLabels: string[],
	) => {
		const labelName = originalLabels.filter(
			(label) => !updatedLabels.includes(label),
		);

		return labelName;
	};

	const displayLabelNames = (labels: string[]) => {
		return labels.join(", ");
	};

	const displayLabelUpdate = (log: TaskEvent) => {
		const originalLabels = log.originalLabels || [];
		const updatedLabels = log.updatedLabels || [];

		if (updatedLabels.length > originalLabels.length) {
			const labelNamesAdded = findLabelAdded(originalLabels, updatedLabels);
			return (
				<p>
					added {labelNamesAdded.length === 1 ? " label " : " labels "}
					<span className="text-foreground">
						{displayLabelNames(labelNamesAdded)}
					</span>
				</p>
			);
		}
		if (originalLabels.length > updatedLabels.length) {
			const labelNamesRemoved = findLabelRemoved(originalLabels, updatedLabels);
			return (
				<p>
					removed {labelNamesRemoved.length === 1 ? " label " : " labels "}
					<span className="text-foreground">
						{displayLabelNames(labelNamesRemoved)}
					</span>
				</p>
			);
		}
	};

	const displayDescriptionUpdate = (log: TaskEvent) => {
		const noDescription = log.originalValue?.length === 0;
		const descriptionUpdated =
			log.originalValue &&
			log.originalValue?.length > 0 &&
			log.updatedValue &&
			log.updatedValue?.length > 0;
		if (noDescription) {
			return (
				<p>
					added description{" "}
					<span className="text-foreground">{log.updatedValue}</span>
				</p>
			);
		}
		if (descriptionUpdated) {
			return (
				<p>
					updated description from{" "}
					<span className="text-foreground">{log.originalValue}</span> to{" "}
					<span className="text-foreground">{log.updatedValue}</span>
				</p>
			);
		}
		return (
			<p>
				removed description{" "}
				<span className="text-foreground">{log.originalValue}</span>
			</p>
		);
	};

	const displayGitUpdate = (log: TaskEvent) => {
		const gitUpdateText = log.gitUpdated || "";
		const urlPattern = /(https?:\/\/[^\s]+)/g;

		// Split the gitUpdateText into an array of strings and URLs
		const parts = gitUpdateText.split(urlPattern);

		return (
			<p>
				{parts.map((part) =>
					urlPattern.test(part) ? (
						<a
							key={`-${part}-`}
							href={part}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-500 underline hover:text-blue-700 font-semibold"
						>
							{part}
						</a>
					) : (
						part
					),
				)}
			</p>
		);
	};

	const getAssigneeActions = (
		originalAssignee: string,
		updatedAssignee: string,
	) => {
		const noPreviousAssignee =
			originalAssignee === "not Assigned" && updatedAssignee !== "not Assigned";

		const assigneeRemoved = updatedAssignee === "not Assigned";

		return {
			noPreviousAssignee,
			assigneeRemoved,
		};
	};

	const displayAssigneeUpdate = (log: TaskEvent) => {
		const { originalAssigneeId, updatedAssigneeId, authorId } = log;
		const { noPreviousAssignee, assigneeRemoved } = getAssigneeActions(
			originalAssigneeId ?? "",
			updatedAssigneeId ?? "",
		);
		const selfAssigned = authorId === updatedAssigneeId;
		if (noPreviousAssignee && selfAssigned) {
			return <p>self assigned task</p>;
		}
		if (noPreviousAssignee && !selfAssigned) {
			return (
				<p>
					assigned task to{" "}
					<span className="text-foreground">{updatedAssigneeId}</span>
				</p>
			);
		}
		if (assigneeRemoved) {
			return <p>unassigned task</p>;
		}
		return (
			<p>
				changed assignee from{" "}
				<span className="text-foreground">{originalAssigneeId}</span> to{" "}
				<span className="text-foreground">{updatedAssigneeId}</span>
			</p>
		);
	};

	const displayUpdate = (log: TaskEvent) => {
		switch (log.type) {
			case EventType.TitleUpdated:
				return (
					<p>
						updated title from{" "}
						<span className="text-foreground">{log.originalValue}</span> to{" "}
						<span className="text-foreground">{log.updatedValue}</span>
					</p>
				);

			case EventType.DescriptionUpdated:
				return displayDescriptionUpdate(log);
			case EventType.GitUpdated:
				return displayGitUpdate(log);
			case EventType.StatusUpdated:
				return (
					<p>
						updated status from{" "}
						<span className="text-foreground">{log.originalValue}</span> to{" "}
						<span className="text-foreground">{log.updatedValue}</span>
					</p>
				);
			case EventType.PriorityUpdated:
				return (
					<p>
						updated priority from{" "}
						<span className="text-foreground">{log.originalValue}</span> to{" "}
						<span className="text-foreground">{log.updatedValue}</span>
					</p>
				);
			case EventType.LabelsUpdated:
				return displayLabelUpdate(log);
			case EventType.AssigneeUpdated:
				return displayAssigneeUpdate(log);
			default:
				return "";
		}
	};

	const displayDate = (date: string) => {
		if (date) {
			const parsedDate = parseISO(date);
			const formattedDate = formatDate(parsedDate, "dd MMM yyyy");
			return formattedDate;
		}
	};

	const displayAuthorProfile = (authorName: string) => {
		return (
			<>
				<ProfileImage profileName={authorName} location={"activityItem"} />
				<p className="ml-2">{authorName}</p>
			</>
		);
	};

	return (
		<div className="w-full">
			<ul className="list-none px-8">
				{eventLogs?.map((log: ActivityType) => {
					return (
						// 	<li
						// 	className="flex items-center text-foreground border-t border-border py-1 list-none"
						// 	key={createdAt.toLocaleDateString()}
						// >
						// 		<div className="mr-4 text-muted-foreground">{`${displayDate(createdAt.toLocaleDateString())}`}</div>
						// 		<div className="flex items-center mr-4">
						// 			{/* {displayAuthorProfile(authorId)} */}
						// 		</div>
						// 		<div className="text-muted-foreground text-ellipses">
						// 			{displayUpdate(log)}
						// 		</div>
						// 	</li>

						<Table key={log.id}>
							<TableBody>
								{eventLogs?.map((log: ActivityType) => (
									<TableRow key={log.createdAt.toLocaleDateString()}>
										<TableCell>
											{displayDate(log.createdAt.toLocaleDateString())}
										</TableCell>
										<TableCell>
											{displayAuthorProfile(log.taskEvent?.authorName ?? "")}
										</TableCell>
										{log.taskEvent && (
											<TableCell>{displayUpdate(log.taskEvent)}</TableCell>
										)}
									</TableRow>
								))}
							</TableBody>
						</Table>
					);
				})}
			</ul>
		</div>
	);
};

export default UpdatedByInformation;
