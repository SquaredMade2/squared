"use client";
import WorkspaceInitials from "@/components/WorkspaceImage";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useTaskStore, useTeamStore, useViewStore } from "@/store";
import { useOrganization } from "@clerk/nextjs";
import Link from "next/link";

export const TaskBreadcrumbs = () => {
	const { organization, memberships } = useOrganization({ memberships: true });
	const organizations = memberships?.data?.map((item) => item.organization);
	const { currentTask: task } = useTaskStore((state) => state);
	const { team } = useTeamStore((state) => state);
	const { lastVisitedPage } = useViewStore((state) => state);
	const index: number =
		organization && organizations
			? organizations?.findIndex((item) => item.id === organization.id)
			: -1;

	return (
		<>
			<Breadcrumb className="ml-4">
				<BreadcrumbList className="flex w-full items-center gap-2 whitespace-nowrap text-foreground">
					<BreadcrumbItem>
						{organization && (
							<Link
								className="flex items-center text-muted-foreground hover:text-foreground"
								href={`${lastVisitedPage === "inbox" ? "/inbox" : `/${organization?.slug}/team/${team?.identifier}/${lastVisitedPage}`}`}
							>
								<div className="mt-0.5 rounded">
									<WorkspaceInitials
										workspaceName={organization.name}
										backgroundColor={index}
										location="workspaceMenu"
									/>
								</div>
								<p>{organization?.slug}</p>
							</Link>
						)}
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem className="max-w-full truncate">
						{task?.title ?? ""}
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</>
	);
};
