"use client";

import {
	Circle,
	CircleCheckBig,
	CircleDashed,
	CircleFadingPlus,
} from "lucide-react";
import { inProgress } from "@/components/Svg";
import { statusOptions } from "@/constants/designations";
import { useToast } from "@/components/ui/use-toast";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Status } from "@repo/db";
import type { DesignationsContainerProps } from "../DesignationsContainer/DesignationsContainer.interfaces";

const StatusDropdownButton = ({
	newIssueData,
	setNewIssueData,
}: DesignationsContainerProps) => {
	const { toast } = useToast();
	const status = newIssueData.status;

	const showIcon = (name: string | undefined) => {
		switch (name) {
			case "backlog":
				return <CircleDashed className="size-4" />;
			case "todo":
				return <Circle className="size-4" />;
			case "inProgress":
				return inProgress();
			case "inReview":
				return <CircleFadingPlus className="size-4 text-[#7394FF]" />;
			case "done":
				return <CircleCheckBig className="size-4 text-[#7394FF]" />;
			default:
				return <Circle className="size-4" />;
		}
	};

	const handleSelectStatus = (newStatus: Status) => {
		if (newStatus === newIssueData.status) return;
		updateItem(newStatus);
	};

	const updateItem = (newStatus: Status) => {
		try {
			setNewIssueData({ ...newIssueData, status: newStatus });
		} catch (err) {
			toast({
				title: "Error setting status",
				variant: "destructive",
			});
		}
	};

	return (
		<Select
			onValueChange={(value) => handleSelectStatus(value as Status)}
			defaultValue={status}
		>
			<SelectTrigger className="grow justify-between hover:cursor-pointer bg-transparent">
				<SelectValue placeholder="Select status">
					<div className="w-full flex items-center justify-between">
						{showIcon(status)}
						<span className="ml-2">{status}</span>
					</div>
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{statusOptions.map((status) => (
					<SelectItem key={status} value={status}>
						<div className="flex items-center justify-between w-full">
							<div className="flex items-center">
								{showIcon(status)}
								<span className="ml-2">{status}</span>
							</div>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default StatusDropdownButton;
