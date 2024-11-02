"use client";

import type { ReactNode } from "react";
import { AuthStoreProvider } from "./auth";
import { CommentStoreProvider } from "./comments";
import { EventStoreProvider } from "./events";
import { ModalStoreProvider } from "./modals";
import { TaskStoreProvider } from "./tasks";
import { TeamStoreProvider } from "./teams";
import { UserStoreProvider } from "./users";
import { ViewStoreProvider } from "./views";
import { WorkspaceStoreProvider } from "./workspaces";
import { FilterStoreProvider } from "./filters";

// Create the combined provider component
export const SquaredStoreProvider = ({ children }: { children: ReactNode }) => {
	return (
		<AuthStoreProvider>
			<CommentStoreProvider>
				<EventStoreProvider>
					<FilterStoreProvider>
						<ModalStoreProvider>
							<TaskStoreProvider>
								<TeamStoreProvider>
									<UserStoreProvider>
										<ViewStoreProvider>
											<WorkspaceStoreProvider>
												{children}
											</WorkspaceStoreProvider>
										</ViewStoreProvider>
									</UserStoreProvider>
								</TeamStoreProvider>
							</TaskStoreProvider>
						</ModalStoreProvider>
					</FilterStoreProvider>
				</EventStoreProvider>
			</CommentStoreProvider>
		</AuthStoreProvider>
	);
};
