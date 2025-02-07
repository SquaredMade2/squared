"use client";

import { workspaceService } from "@/lib/services";
import { useModalStore } from "@/store";
import { useUser } from "@clerk/nextjs";
import { TODO } from "@squared/context";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@squaredmade/ui/select";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { useToast } from "../ui/use-toast";

export const inviteModal = () => {
	const [expirationPeriod, setExpirationPeriod] = useState<string>("1h");
	// const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
	const { showInvite, setShowInvite } = useModalStore((state) => state);
	const { toast } = useToast();
	const { user } = useUser();

	const expirationTimes = ["15m", "30m", "1h", "6h", "12h", "1d", "7d"];

	const generateToken = async () => {
		await workspaceService.generateToken(workspace.id, expirationPeriod);
	};

	useEffect(() => {
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
						<Select>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{expirationTimes.map((time: string) => {
										return (
											<SelectItem key={time} value={time}>
												{time.replace(/([])/)}
											</SelectItem>
										);
									})}
								</SelectGroup>
							</SelectContent>
						</Select>
						<div className="w-full border border-border" />
						<DialogFooter>
							<Button>
								<span className="mr-2.5">
									<Pencil className="size-4" />
								</span>
								<p>
									Rename task to
									<span className="ml-2 italic">{`"${inputValue}"`}</span>
								</p>
							</Button>
						</DialogFooter>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
