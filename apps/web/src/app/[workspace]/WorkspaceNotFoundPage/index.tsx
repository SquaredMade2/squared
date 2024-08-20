import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { handleWorkspaceNameOverflow } from "@/utils/formatting";
import WorkspaceInitials from "@/components/WorkspaceImage";
import { Check, FileSearch } from "lucide-react";

const WorkspaceNotFoundPage = (): React.ReactElement => {
	const router = useRouter();

	const [menuOpen, setMenuOpen] = useState(false);

	const user = useAppSelector((state) => state.userSettings.user);
	const allWorkspaces = useAppSelector((state) => state.taskData.workspaces);
	const { theme } = useAppSelector((state) => state.userSettings);
	const currentWorkspace = useAppSelector(
		(state) => state.taskData.currentWorkspace,
	);

	const handleOffClick: () => void = () => {
		if (menuOpen) {
			setMenuOpen(false);
		}
	};

	return (
		<div
			className="w-full h-screen text-3xl flex flex-col items-center justify-center text-foreground bg-background"
			onClick={handleOffClick}
		>
			<div className="w-full h-1/2 flex flex-col items-center justify-around mb-20">
				<FileSearch className="size-16 text-[#717171]" />
				<h1 className="text-5xl font-semibold">Workspace Not Found</h1>
				<h2 className="text-gray-400">
					The workspace you are looking for can&apos;t be found.
				</h2>
				<button
					type="button"
					onClick={() => setMenuOpen(!menuOpen)}
					className={`w-1/7 h-20 duration-200 shadow-lg rounded focus:outline-none focus:shadow-sm active:shadow-3xl cursor-pointer hover:shadow-glow text-2xl px-5 ${
						theme === "dark"
							? "bg-blueButton"
							: "bg-blueGlowLight border border-blueGlow"
					}`}
				>
					Select Another Workspace
				</button>
				{user && (
					<div
						className={`w-64 mt-3 border border-border bg-popover z-40 rounded-lg pb-1 absolute transition-all duration-100 ${
							menuOpen
								? "transform translate-y-0 scale-100 opacity-100 pointer-events-auto"
								: "transform -translate-y-6 scale-95 opacity-0 pointer-events-none"
						}`}
					>
						<div className="py-3 px-3.5">
							<p className="mb-3 text-muted-foreground text-sm">{user.email}</p>
							<ul>
								{allWorkspaces.map((workspace, index) => (
									<Link
										legacyBehavior
										href={`/${workspace.url}`}
										className="px-3 py-1.5 flex items-center hover:bg-popoverHover rounded text-sm font-medium cursor-default justify-between"
										key={workspace._id}
									>
										<div>
											<div className="flex">
												<WorkspaceInitials
													workspaceName={workspace.name}
													backgroundColor={index}
													location="workspaceList"
												/>
												<li>{handleWorkspaceNameOverflow(workspace.name)}</li>
											</div>
											{workspace.name === currentWorkspace.name && (
												<div>
													<Check className="text-[#575BC7] size-5" />
												</div>
											)}
										</div>
									</Link>
								))}
							</ul>
						</div>
						<span className="w-full border-t border-border block pb-1" />
						<ul className="px-1.5">
							<li
								onClick={() => router.push("/join")}
								className="px-2 py-1.5 hover:bg-popoverHover rounded text-sm text-popover-foreground cursor-default"
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
