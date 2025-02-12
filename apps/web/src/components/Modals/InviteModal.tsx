"use client";

import { workspaceService } from "@/lib/services";
import { useModalStore, useWorkspaceStore } from "@/store";
import { TODO } from "@squared/context";
import { useLayoutEffect, useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { toast } from "../ui/use-toast";

export const InviteModal = () => {
	const [expirationPeriod, setExpirationPeriod] = useState<string>("7d");
	const [numberUses, setNumberUses] = useState<number | undefined>();
	const [isUnlimitedUses, setIsUnlimitedUses] = useState<boolean>(false);
	const [link, setLink] = useState<string>("");
	const { showInvite, setShowInvite } = useModalStore((state) => state);
	const { workspace } = useWorkspaceStore((state) => state);

	const expirationTimes = ["15m", "30m", "1h", "6h", "12h", "1d", "7d"];

	const generateLink = async () => {
		console.log(expirationPeriod, numberUses, isUnlimitedUses);
		try {
			workspace &&
				setLink(
					await workspaceService.generateWorkspaceInviteLink(TODO, {
						workspaceId: workspace?.id,
						expiration:
							expirationPeriod === "never" ? undefined : expirationPeriod,
						uses: numberUses,
					}),
				);
		} catch (error) {
			toast({
				title: "Error creating link",
				description: error instanceof Error && error.message,
				variant: "destructive",
			});
			setLink("Failed to generate link");
		}
	};

	const handleCopy = async () => {
		const url = `${process.env.NEXT_PUBLIC_URL}/join?link&token=${link}`;
		await window.navigator.clipboard.writeText(url);
		toast({ title: "URL copied to clipboard" });
	};

	// useLayoutEffect(() => {
	// 	generateLink();
	// }, []);

	return (
		<Dialog open={showInvite} onOpenChange={setShowInvite}>
			<DialogContent className="md:w-[500px]">
				<div className="flex flex-col gap-6 px-1">
					<DialogHeader>
						<DialogTitle>Invite people to your Workspace</DialogTitle>
					</DialogHeader>
					<hr className="w-full border border-border" />
					<div className="flex flex-col gap-5">
						<div className="flex flex-col gap-3">
							<Label htmlFor="expire">Expire after</Label>
							<Select
								onValueChange={(value) => {
									setExpirationPeriod(value);
								}}
								value={expirationPeriod}
								defaultValue="7d"
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select an expiration" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{expirationTimes.map((time: string) => {
											return (
												<SelectItem key={time} value={time}>
													{time.replace(
														/(\d+)([mhd])/g,
														(_, num: string, unit: string) => {
															const units: Record<string, string> = {
																m: "minute",
																h: "hour",
																d: "day",
															};
															return `${num} ${units[unit]}${Number(num) > 1 ? "s" : ""}`;
														},
													)}
												</SelectItem>
											);
										})}
										<SelectItem value="never">Never</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
						<div className="flex flex-col gap-3">
							<Label htmlFor="name" className="">
								Number of Uses
							</Label>
							<Input
								id="usues"
								type="number"
								min={1}
								disabled={isUnlimitedUses}
								onChange={() => setNumberUses(1)}
							/>
							<div className="flex gap-2">
								<Checkbox
									onClick={() => setIsUnlimitedUses(!isUnlimitedUses)}
								/>
								<Label>Unlimited Uses</Label>
							</div>
						</div>
						<Button onClick={generateLink}>Generate Link</Button>
					</div>
					<hr className="w-full border border-border" />
					<DialogFooter>
						<div className="w-full flex items-center justify-between gap-2 p-2 border border-border rounded-lg">
							<p className="text-white/35">
								{(!link && "Create Invite Link") ||
									(link.includes("Failed") && link) ||
									`/join?link&token=${link}`}
							</p>
							<Button
								className="h-8"
								disabled={!link || link.includes("Failed")}
								onClick={handleCopy}
							>
								Copy
							</Button>
						</div>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	);
};
