"use client";

import { client } from "@/lib/client";
import { useModalStore, useWorkspaceStore } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { number } from "zod";
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
	const [numberUses, setNumberUses] = useState<number | undefined>(undefined);
	const [isUnlimitedUses, setIsUnlimitedUses] = useState<boolean>(false);
	const [link, setLink] = useState<string>("");
	const { showInvite, setShowInvite } = useModalStore((state) => state);
	const { workspace } = useWorkspaceStore((state) => state);

	const expirationTimes = ["15m", "30m", "1h", "6h", "12h", "1d", "7d"];

	// This counter-acts some known funny business when a dialog is opened from another dialog.
	// A delay is necessary to properly reset the pointer-events on the body.
	useEffect(() => {
		const timer = setTimeout(() => {
			document.body.style.pointerEvents = `${showInvite ? "none" : "auto"}`;
		}, 1);

		return () => clearTimeout(timer);
	}, [showInvite]);

	const createWorkspaceLinkMutation = useMutation({
		mutationFn: async () => {
			const inviteLink = await client.workspace.generateWorkspaceInviteLink
				.$post({
					workspaceId: workspace?.id || "",
					expiration:
						expirationPeriod === "never" ? undefined : expirationPeriod,
					uses: numberUses,
				})
				.then((res) => res.text());

			return inviteLink;
		},
		onSuccess: (inviteLink) => {
			setLink(inviteLink);
		},
		onError: (error) => {
			toast({
				title: "Error creating link",
				description: error instanceof Error && error.message,
				variant: "destructive",
			});
			setLink("Failed to generate link");
		},
	});

	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const updateUses = useCallback((e: { target: HTMLInputElement }) => {
		const uses = Number(e.target.value);

		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}

		timerRef.current = setTimeout(() => {
			setNumberUses(uses);
		}, 1000);
	}, []);

	const generateLink = () => {
		workspace && createWorkspaceLinkMutation.mutate();
	};

	const handleCopy = async () => {
		const url = `${process.env.NEXT_PUBLIC_URL}/${workspace?.name}/join?link=true&token=${link}`;
		await window.navigator.clipboard.writeText(url);
		toast({ title: "URL copied to clipboard" });
	};

	return (
		<Dialog open={showInvite} onOpenChange={() => setShowInvite(!showInvite)}>
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
								onChange={(e: { target: HTMLInputElement }) => updateUses(e)}
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
							<p>
								{(!link && "Create Invite Link") ||
									(link.includes("Failed") && link) ||
									`/join?link=true&token=${link}`}
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
