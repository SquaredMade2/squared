"use client";
import SettingsTopNavBar from "@/components/Settings/SettingsTopNavBar";
import { GithubIcon } from "@/components/Svg";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useOrganization } from "@clerk/nextjs";
import Link from "next/link";

const IntegrationSettings = () => {
	const { organization } = useOrganization();
	return (
		<div className="relative flex h-screen min-h-screen w-full bg-card xs:p-0 mdsm:flex-col">
			<div className="bg-background mdsm:visible lg:hidden">
				<SettingsTopNavBar />
			</div>
			<div className="flex h-full w-full flex-col items-center bg-background xs:px-10 pt-20 xs:pt-10 sm:items-start sm:px-4 md:items-center">
				<div className="w-full md:px-20 lg:px-40 xl:px-80">
					<div className="mb-8 flex-col">
						<h3 className="mb-3 font-medium text-2xl text-foreground">
							Integrations
						</h3>
						<header className="text-muted-foreground text-sm">
							Enhance Squared experience by integrating add-ons
						</header>
					</div>
					<Link href={`/${organization?.slug}/settings/integrations/github`}>
						<Card className="hover:bg-secondary">
							<CardHeader className="flex flex-row items-center">
								<div className="ml-4 flex h-16 w-16 items-center justify-center rounded-lg bg-white p-2">
									<div className="w-[50px]">
										<GithubIcon />
									</div>
								</div>
								<div className="mx-5 flex flex-col space-y-1">
									<CardTitle>Github</CardTitle>
									<CardDescription>
										Automate your pull request and commit workflows and keep
										tasks synced both ways
									</CardDescription>
								</div>
							</CardHeader>
						</Card>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default IntegrationSettings;
