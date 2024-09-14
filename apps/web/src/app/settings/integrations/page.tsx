"use client";
import SettingsTopNavBar from "@/components/SettingsTopNavBar";
import { GithubIcon } from "@/components/Svg";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useViewStore } from "@/storeZ";
import Link from "next/link";

const IntegrationSettings: React.FC = () => {
	const { showNavbar, setShowNavbar } = useViewStore((state) => state);

	const handleNavToggle = (): void => {
		const navBarValue = !showNavbar;
		setShowNavbar(navBarValue);
	};

	return (
		<div className="flex mdsm:flex-col relative bg-card h-screen min-h-screen xs:p-0 w-full">
			<div className="lg:hidden mdsm:visible bg-background">
				<SettingsTopNavBar />
			</div>
			<div className="flex flex-col h-full w-full items-center bg-background pt-20 md:items-center sm:items-start sm:px-4 xs:pt-10 xs:px-10">
				<div className="w-full md:px-20 lg:px-40 xl:px-80">
					<div className="flex-col mb-8">
						<h3 className="text-2xl text-foreground mb-3 font-medium">
							Integrations
						</h3>
						<header className="text-muted-foreground text-sm">
							Enhance Squared experience by integrating add-ons
						</header>
					</div>
					<Link href={"/settings/integrations/github"}>
						<Card className="hover:bg-secondary">
							<CardHeader className="flex flex-row items-center justify-center">
								<div className="flex justify-center items-center w-16 h-16 p-2 bg-white rounded-lg ml-4">
									<div className="w-[50px]">
										<GithubIcon />
									</div>
								</div>
								<div className="flex flex-col mx-5 space-y-1">
									<CardTitle>Github</CardTitle>
									<CardDescription>
										Automate your pull request and commit workflows and keep
										issues synced both ways
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
