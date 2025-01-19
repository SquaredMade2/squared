import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: "https://app.squaredmade.com/",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/[workspace]/",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/[workspace]/archive/recently-deleted-tasks",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/[workspace]/archive/tasks",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/[workspace]/join",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/[workspace]/my-tasks/assigned",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/[workspace]/my-tasks/created",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/[workspace]/task/[taskIdentifier]/[taskName]",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/[workspace]/team/[identifier]/active",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/[workspace]/team/[identifier]/all",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/[workspace]/team/[identifier]/backlog",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/[workspace]/team/[identifier]/sprints/[sprintId]",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/[workspace]/team/[identifier]/sprints/[sprintId]/retrospective",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/[workspace]/team/[identifier]/sprints/current",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/[workspace]/team/[identifier]/sprints/upcoming",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/[workspace]/team/[identifier]/views/[filterId]",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/forgotPassword/[token]",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/inbox",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/join/[token]",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/sign-in",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/sign-up",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/settings/integrations/github",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/settings/integrations",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/settings/members",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/settings/new-team",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/settings/profile",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/settings/teams/[identifier]/overview",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/settings/teams/[identifier]/sprints",
			lastModified: new Date().toISOString(),
		},
		{
			url: "https://app.squaredmade.com/settings/workspace",
			lastModified: new Date().toISOString(),
		},
	];
}
