import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "@squared/icons";

export const LoadingTask = () => {
	return (
		<>
			<div className="space-around scrollbar-thin flex min-h-screen w-full overflow-auto max850:overflow-x-hidden mdlg:w-full">
				<div className="h-full w-full p-2 md:p-5 xl:px-10">
					<div className="relative flex w-full">
						<div className="mr-1 flex w-full snap-start flex-col overflow-x-hidden max850:mr-1 md:mr-5 xl:mr-10">
							<div>
								<div className="mt-1 flex items-center gap-2">
									<Skeleton className="size-6 rounded-full" />
									<p className="blink text-muted-foreground blur-sm filter">
										It is a long
									</p>
									<span className="text-secondary">
										<ChevronRight className="size-4 stroke-gray-500" />
									</span>
									<p className="blink text-muted-foreground blur-sm filter">
										consequuntur
									</p>
								</div>
							</div>
							<div className="mt-10 h-20 pt-2 pl-2">
								<p className="blink text-muted-foreground blur-sm filter">
									consequuntur
								</p>
							</div>
							<div className="h-24 w-full rounded-lg bg-popover p-2 ">
								<p className="blink text-muted-foreground blur-sm filter">
									It is a long established fact that a reader will be distracted
								</p>
							</div>
							<div className="mt-3 flex flex-col gap-5">
								<div className="w-full border-border border-b text-foreground">
									<div className="flex gap-10">
										<button
											type="button"
											className="rounded-t-lg bg-accent px-10 py-2"
										>
											Activities
										</button>
										<button type="button" className="px-10 py-2">
											Comments
										</button>
									</div>
								</div>
								<div className="flex min-h-24 flex-col rounded-lg bg-popover p-2">
									<div className="flex gap-5 border-b py-2">
										<p className="blink text-muted-foreground blur-sm filter">
											25 Jun 2024
										</p>
										<Skeleton className="size-6 rounded-full" />
										<p className="blink text-muted-foreground blur-sm filter">
											Pinak
										</p>
										<p className="blink text-muted-foreground blur-sm filter">
											letters as opposed to using Content
										</p>
									</div>
									<div className="flex gap-5 py-2">
										<p className="blink text-muted-foreground blur-sm filter">
											25 Jun 2024
										</p>
										<Skeleton className="size-6 rounded-full" />
										<p className="blink text-muted-foreground blur-sm filter">
											John Doe
										</p>
										<p className="blink text-muted-foreground blur-sm filter">
											letters as opposed to using Content
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="relative transition-all duration-300 ease-in-out max850:hidden">
							<div className="h-12 rounded-lg bg-popover px-5">
								<div className="flex h-full items-center justify-between">
									<p className="blink text-muted-foreground blur-sm filter">
										SQU-19
									</p>
									<div className="flex gap-2">
										<span>
											<Skeleton className="size-6 rounded-full" />
										</span>
										<span>
											<Skeleton className="size-6 rounded-full" />
										</span>
									</div>
								</div>
							</div>
							<div className="mt-5 flex h-92 flex-col gap-8 rounded-lg bg-popover p-5 text-muted-foreground">
								<div className="flex ">
									<span className=" w-24">Status</span>
									<div className="flex gap-2">
										<Skeleton className="size-4 rounded-full" />
										<p className="blink text-muted-foreground blur-sm filter">
											Todo
										</p>
									</div>
								</div>
								<div className="flex">
									<span className="w-24">Priority</span>
									<div className="flex gap-2">
										<Skeleton className="size-4 rounded-full" />
										<p className="blink text-muted-foreground blur-sm filter">
											No Priority
										</p>
									</div>
								</div>
								<div className="flex items-center">
									<span className="w-24">Labels</span>
									<div className="flex flex-grow flex-col gap-2">
										<div className="flex w-20 gap-2 rounded-full border px-2 py-1">
											<Skeleton className="size-4 rounded-full" />
											<p className="blink text-muted-foreground blur-sm filter">
												Bug
											</p>
										</div>
										<div className="flex gap-2 rounded-full border border-border px-2 py-1">
											<Skeleton className="size-4 rounded-full" />
											<p className="blink text-muted-foreground blur-sm filter">
												Improvement
											</p>
										</div>
									</div>
								</div>
								<div className="flex ">
									<span className="w-24">Due Date</span>
									<div className="flex items-center rounded-full border border-border px-2 py-1">
										<p className="blink text-muted-foreground blur-sm filter">
											01/07/2023
										</p>
									</div>
								</div>
								<div className="flex ">
									<span className="w-24">Effort</span>
									<div className="flex gap-2">
										<Skeleton className="size-4 rounded-full" />
										<p className="blink text-muted-foreground blur-sm filter">
											Effort
										</p>
									</div>
								</div>
								<div className="flex ">
									<span className="w-24">Assignee</span>
									<div className="flex gap-2">
										<Skeleton className="size-4 rounded-full" />
										<p className="blink text-muted-foreground blur-sm filter">
											Unassigned
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
