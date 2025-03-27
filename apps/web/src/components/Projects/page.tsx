import { ProjectsBreadcrumbs } from "@/components/Projects/ProjectsBreadcrumbs";
import {
	Archive,
	ChevronDown,
	CircleX,
	Copy,
	CopyPlus,
	Ellipsis,
	Plus,
	Search,
	SquareDashed,
	Table2,
	X,
} from "@squared/icons";
import { Button } from "../ui/button";

const ProjectsPage = () => {
	return (
		<div className="flex h-screen w-full overflow-hidden bg-background">
			<ProjectsBreadcrumbs />
			<div>
				{/* Projects Sidebar */}
				<div>
					<div>
						<Table2 />
						<p>Projects</p>
					</div>
					<div>
						<SquareDashed />
						<p>Templates</p>
					</div>
				</div>
				<div>
					{/* Projects search/create new and table */}
					<div>
						{/* Projects search/create */}
						<div>
							<div>
								<Search />
								<input type="text" name="" id="" />
								<CircleX />
							</div>
							{/* Should only allow admins and owners the ability to add new projects */}
							<div>
								<Button>
									<Plus />
									<p>New project</p>
								</Button>
							</div>
						</div>
					</div>
					<div>
						{/* Projects Table */}
						<div>
							{/* Show Open or Closed Projects and Sort Dropdown */}
							<div>
								{/* Show by open/closed projects */}
								<div>
									<Table2 />
									<p>{"number of open projects"} Open</p>
								</div>
								<div>
									<Archive />
									<p>{"number of closed projects"} Closed</p>
								</div>
							</div>
							<div>
								{/* Projects sorting */}
								<div>
									<p>Sort</p>
									<ChevronDown />
								</div>
								{/* Sort Dropdown (add check to current sort option) */}
								<div>
									<ul>
										<li>Recently added</li>
										<li>Newest</li>
										<li>Oldest</li>
										<li>Name</li>
										<li>Least Recently updated</li>
									</ul>
								</div>
							</div>
						</div>
						<div>
							{/* Main projects table body showing projects and info */}
							<ul>
								<li>
									<div>
										<div>
											<Table2 />
											<p>Project Name</p>
											{/* labels or badges */}
										</div>
										<p>{/* Show when last updated */}</p>
									</div>
									<div>
										<Ellipsis />
										<div>
											{/* Project options menu */}
											<ul>
												<li>
													<Copy />
													<p>Make a copy</p>
												</li>
												<li>
													<CopyPlus />
													<p>Copy as template</p>
												</li>
												<li>
													<X />
													<p>Remove Project</p>
												</li>
											</ul>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProjectsPage;
