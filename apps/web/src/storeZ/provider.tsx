"use client";

import type { ReactNode } from "react";
import { ActivityStoreProvider } from "./activities";
import { AuthStoreProvider } from "./auth";
import { CommentStoreProvider } from "./comments";
import { ModalStoreProvider } from "./modals";
import { NotificationStoreProvider } from "./notifications";
import { TaskStoreProvider } from "./tasks";
import { TeamStoreProvider } from "./teams";
import { UserStoreProvider } from "./users";
import { ViewsStoreProvider } from "./views";
import { WorkspacesStoreProvider } from "./workspaces";

// Create the combined provider component
export const SquaredStoreProvider = ({ children }: { children: ReactNode }) => {
	return (
		<ActivityStoreProvider>
			<AuthStoreProvider>
				<CommentStoreProvider>
					<ModalStoreProvider>
						<NotificationStoreProvider>
							<TaskStoreProvider>
								<TeamStoreProvider>
									<UserStoreProvider>
										<ViewsStoreProvider>
											<WorkspacesStoreProvider>
												{children}
											</WorkspacesStoreProvider>
										</ViewsStoreProvider>
									</UserStoreProvider>
								</TeamStoreProvider>
							</TaskStoreProvider>
						</NotificationStoreProvider>
					</ModalStoreProvider>
				</CommentStoreProvider>
			</AuthStoreProvider>
		</ActivityStoreProvider>
	);
};
