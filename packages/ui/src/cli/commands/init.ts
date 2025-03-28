/* eslint-disable no-console */
import inquirer from "inquirer";
import { updateGlobalsCss } from "../utils/css-setup";
import { detectPackageManager } from "../utils/detect-package-manager";
import { isInstalledAsDependency } from "../utils/file-helpers";
import {
	createPostcssConfig,
	installDependencies,
} from "../utils/tailwind-setup";

interface InitOptions {
	skipTailwind?: boolean;
	skipCss?: boolean;
	yes?: boolean;
}

/**
 * Main initialization function that sets up the design system
 */
export async function init(options: InitOptions = {}): Promise<void> {
	console.log("🎨 Initializing Squared UI...");

	// Check if the design system is installed as a dependency
	if (!(await isInstalledAsDependency())) {
		console.error("Error: @squared/ui is not installed in this project.");
		console.log("Please install it first with: npm install @squared/ui");
		process.exit(1);
	}

	// Detect package manager
	const packageManager = await detectPackageManager();
	console.log(`📦 Detected package manager: ${packageManager}`);

	// Determine if we should set up Tailwind
	let setupTailwind = !options.skipTailwind;

	if (!options.yes && !options.skipTailwind) {
		const { useTailwind } = await inquirer.prompt([
			{
				type: "confirm",
				name: "useTailwind",
				message: "Do you want to use Tailwind CSS with Squared UI?",
				default: true,
			},
		]);

		setupTailwind = useTailwind;
	}

	if (setupTailwind)
		await Promise.all([
			installDependencies(packageManager),
			createPostcssConfig(),
		]);

	// Set up or update globals.css
	if (!options.skipCss) {
		let customCssPath = "";

		if (!options.yes) {
			const { customPath } = await inquirer.prompt([
				{
					type: "input",
					name: "customPath",
					message:
						"Where is your globals.css file? (leave empty to autodetect)",
					default: "",
				},
			]);

			customCssPath = customPath;
		}

		if (setupTailwind) await updateGlobalsCss(customCssPath);
	}

	console.log("");
	console.log("🎉 Squared UI has been successfully set up!");
	console.log("");
	console.log("Next steps:");
	console.log("  1. Import the CSS in your app:");
	console.log('     import "@squared/ui/styles";');
	console.log("");
	console.log("  2. Start using components:");
	console.log('     import { Button } from "@squared/ui/button";');
	console.log("");
	console.log("  3. Check out the README for more information.");
	console.log("");
}
