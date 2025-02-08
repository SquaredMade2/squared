"use client";

import { workspaceService } from "@/lib/services";
import { useModalStore, useWorkspaceStore } from "@/store";
import { TODO } from "@squared/context";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@squaredmade/ui/select";
import { useLayoutEffect, useState } from "react";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { toast } from "../ui/use-toast";

export const InviteModal = () => {
	const [expirationPeriod, setExpirationPeriod] = useState<string>("1h");
	const [token, setToken] = useState<string>("");
	const { showInvite, setShowInvite } = useModalStore((state) => state);
	const { workspace } = useWorkspaceStore((state) => state);

	const expirationTimes = ["15m", "30m", "1h", "6h", "12h", "1d", "7d"];

	const generateToken = async () => {
		try {
			workspace &&
				setToken(
					await workspaceService.generateWorkspaceInviteToken(TODO, {
						workspaceId: workspace?.id,
						expirationPeriod,
					}),
				);
		} catch (error) {
			toast({
				title: "Error creating token",
				description: error instanceof Error && error.message,
				variant: "destructive",
			});
		}
	};

	useLayoutEffect(() => {
		generateToken();
	}, []);

	return (
		<Dialog open={showInvite} onOpenChange={setShowInvite}>
			<DialogContent>
				<form onSubmit={generateToken}>
					<div className="flex flex-col gap-4 px-5">
						<DialogHeader>
							<DialogTitle>Expire After</DialogTitle>
						</DialogHeader>
						<Select
							onValueChange={(value) => {
								setExpirationPeriod(value);
							}}
							value={expirationPeriod}
							defaultValue="1h"
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a time limit" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{expirationTimes.map((time: string) => {
										return (
											<SelectItem key={time} value={time}>
												{/* {time.replace(
													/(\d+)([mhd])/g,
													(_, num, unit: string) => {
														const units = { m: "minute", h: "hour", d: "day" };
														return `${num} ${units[unit]}${Number(num) > 1 && "s"}`;
													},
												)} */}
												times
											</SelectItem>
										);
									})}
								</SelectGroup>
							</SelectContent>
						</Select>
						<div className="w-full border border-border" />
						<DialogFooter>
							<div>
								<p>
									{token ? `/join?token=${token}` : "Failed to generate token"}
								</p>
								<Button disabled={Boolean(token)}>Copy</Button>
							</div>
							<Button>Generate Token</Button>
						</DialogFooter>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
