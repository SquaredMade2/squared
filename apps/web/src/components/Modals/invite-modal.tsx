"use client";

import { useOrganization } from "@clerk/nextjs";
import { Copy } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import { Checkbox } from "@squaredmade/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@squaredmade/ui/dialog";
import { Input } from "@squaredmade/ui/input";
import { Label } from "@squaredmade/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@squaredmade/ui/select";
import { toast } from "@squaredmade/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { config } from "@/config";
import { client } from "@/lib/client";
import { LINK_EXPIRATION_TIMES } from "@/lib/constants";
import { useModalStore } from "@/store";

export const InviteModal = () => {
	const [expirationPeriod, setExpirationPeriod] = useState<string>("7d");
	const [numberUses, setNumberUses] = useState<number | undefined>(undefined);
	const [isUnlimitedUses, setIsUnlimitedUses] = useState<boolean>(false);
	const [link, setLink] = useState<string>("");
	const { showInvite, setShowInvite } = useModalStore((state) => state);
	const { organization } = useOrganization();

	// This counter-acts some known funny business when a dialog is opened from another dialog.
	// A delay is necessary to properly reset the pointer-events on the body.
	useEffect(() => {
		const timer = setTimeout(() => {
			document.body.style.pointerEvents = `${showInvite ? "none" : "auto"}`;
		}, 1);

		return () => clearTimeout(timer);
	}, [showInvite]);

	const { mutate: createWorkspaceLinkMutation, isPending } = useMutation({
		mutationFn: async () => {
			return await client.workspace.generateWorkspaceInviteLink
				.$post({
					expiration:
						expirationPeriod === "never" ? undefined : expirationPeriod,
					uses: numberUses,
				})
				.then((res) => res.text());
		},
		onError: (error) => {
			toast.error("Error creating link", {
				description: error.message,
			});
			if (link) setLink("");
		},
		onSuccess: (inviteLink) => setLink(inviteLink),
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

	const handleCopy = async () => {
		const url = `${config.NEXT_PUBLIC_URL}/${organization?.name}/join?token=${link}`;
		try {
			await window.navigator.clipboard.writeText(url);
			toast.success("URL copied to clipboard");
		} catch (_) {
			toast.error("Failed to copy URL", {
				description: "Please try again or copy manually",
			});
		}
	};
	const id = useId();
	const getFormId = (el: string) => `${id}-${el}`;

	return (
		<Dialog onOpenChange={() => setShowInvite(!showInvite)} open={showInvite}>
			<DialogContent>
				<div className="flex flex-col gap-6 px-1">
					<DialogHeader>
						<DialogTitle>Invite people to your Workspace</DialogTitle>
					</DialogHeader>
					<hr className="w-full border border-border" />
					<div className="flex flex-col gap-5">
						<div className="flex flex-col gap-3">
							<Label htmlFor="expire">Expire after</Label>
							<Select
								defaultValue="7d"
								onValueChange={(value) => {
									setExpirationPeriod(value);
								}}
								value={expirationPeriod}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select an expiration" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{LINK_EXPIRATION_TIMES.map((time: string) => {
											return (
												<SelectItem key={time} value={time}>
													{time.replace(
														/(\d+)([mhd])/g,
														(_, num: string, unit: string) => {
															const units: Record<string, string> = {
																d: "day",
																h: "hour",
																m: "minute",
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
							<Label className="" htmlFor={getFormId("uses")}>
								Number of Uses
							</Label>
							<Input
								disabled={isUnlimitedUses}
								id={getFormId("uses")}
								min={1}
								onChange={(e: { target: HTMLInputElement }) => updateUses(e)}
								type="number"
							/>
							<div className="flex gap-2">
								<Checkbox
									onClick={() => setIsUnlimitedUses(!isUnlimitedUses)}
								/>
								<Label>Unlimited Uses</Label>
							</div>
						</div>
						<Button
							disabled={!organization}
							onClick={() => createWorkspaceLinkMutation()}
						>
							Generate Link
						</Button>
					</div>
					<hr className="w-full border border-border" />
					<DialogFooter>
						<div className="flex w-full items-center justify-between gap-2 rounded-lg border border-border p-2">
							{isPending ? (
								<p>Generating link...</p>
							) : (
								<p>
									{link
										? `${config.NEXT_PUBLIC_URL}/${organization?.slug}/join?token=${link}`
										: "Create Invite Link"}
								</p>
							)}
							<Button
								aria-label="Copy invite link"
								className="h-8"
								disabled={!link || link.includes("Failed")}
								onClick={handleCopy}
							>
								<Copy className="mr-2 size-4" />
								Copy
							</Button>
						</div>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	);
};
