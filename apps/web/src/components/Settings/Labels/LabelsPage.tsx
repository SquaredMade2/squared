import type { Workspace } from "@squared/db";

export function LabelsPage({
	labels,
	workspace,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
}: { labels: any[]; workspace?: Workspace | null }) {
	return <>{labels.length > 0 && workspace && <div>labels</div>}</>;
}
