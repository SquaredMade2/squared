import WorkspaceInitials from "@/components/WorkspaceImage";
import { useUserStore } from "@/store";
import { handleWorkspaceNameOverflow } from "@/utils/formatting";
import { useOrganization } from "@clerk/nextjs";
import type { OrganizationResource } from "@clerk/types";
import { FileSearch } from "@squared/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const WorkspaceNotFoundPage = (): React.ReactElement => {
	const router = useRouter();
	const [menuOpen, setMenuOpen] = useState(false);
	const user = useUserStore((state) => state.user);
	const { memberships } = useOrganization({ memberships: true });
	const organizations = memberships?.data?.map(
		(membership) => membership.organization,
	);
	const handleOffClick: () => void = () => {
		if (menuOpen) {
			setMenuOpen(false);
		}
	};

	return (
		<div
			className="flex h-screen w-full flex-col items-center justify-center bg-background text-3xl text-foreground"
			onClick={handleOffClick}
		>
			<div className="mb-20 flex h-1/2 w-full flex-col items-center justify-around">
				<FileSearch className="size-16 text-[#717171]" />
				<h1 className="font-semibold text-5xl">Workspace Not Found</h1>
				<h2 className="text-gray-400">
					The workspace you are looking for can&apos;t be found.
				</h2>
				<button
					type="button"
					onClick={() => setMenuOpen(!menuOpen)}
					className={
						"h-20 w-1/7 cursor-pointer rounded border border-blueGlow bg-blueGlowLight px-5 text-2xl shadow-lg duration-200 hover:shadow-glow focus:shadow-xs focus:outline-hidden active:shadow-3xl dark:bg-blueButton"
					}
				>
					Select Another Workspace
				</button>
				{user && (
					<div
						className={`absolute z-40 mt-3 w-64 rounded-lg border border-border bg-popover pb-1 transition-all duration-100 ${
							menuOpen
								? "pointer-events-auto translate-y-0 scale-100 transform opacity-100"
								: "-translate-y-6 pointer-events-none scale-95 transform opacity-0"
						}`}
					>
						<div className="px-3.5 py-3">
							<p className="mb-3 text-muted-foreground text-sm">{user.email}</p>
							<ul>
								{organizations?.map(
									(org: OrganizationResource, index: number) => (
										<Link
											legacyBehavior
											href={`workspace/${org.slug}`}
											className="flex cursor-default items-center justify-between rounded px-3 py-1.5 font-medium text-sm hover:bg-popoverHover"
											key={org.id}
										>
											<div>
												<div className="flex">
													<WorkspaceInitials
														workspaceName={org.name ?? ""}
														backgroundColor={index}
														location="workspaceList"
													/>
													<li>{handleWorkspaceNameOverflow(org.name ?? "")}</li>
												</div>
											</div>
										</Link>
									),
								)}
							</ul>
						</div>
						<span className="block w-full border-border border-t pb-1" />
						<ul className="px-1.5">
							<li
								onClick={() => router.push("/create")}
								className="cursor-default rounded px-2 py-1.5 text-popover-foreground text-sm hover:bg-popoverHover"
							>
								Create or join a workspace
							</li>
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};

export default WorkspaceNotFoundPage;
