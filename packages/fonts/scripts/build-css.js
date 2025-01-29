const fs = require("node:fs");
const path = require("node:path");

function copyFileSync(source, target) {
	let targetFile = target;

	// If target is a directory, a new file with the same name will be created
	if (fs.existsSync(target) && fs.lstatSync(target).isDirectory()) {
		targetFile = path.join(target, path.basename(source));
	}

	fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target) {
	let files = [];

	// Check if folder needs to be created or integrated
	const targetFolder = path.join(target, path.basename(source));
	if (!fs.existsSync(targetFolder)) {
		fs.mkdirSync(targetFolder, { recursive: true });
	}

	// Copy
	if (fs.lstatSync(source).isDirectory()) {
		files = fs.readdirSync(source);
		for (const file of files) {
			const curSource = path.join(source, file);
			if (fs.lstatSync(curSource).isDirectory()) {
				copyFolderRecursiveSync(curSource, targetFolder);
			} else {
				copyFileSync(curSource, targetFolder);
			}
		}
	}
}

// Ensure dist directory exists
if (!fs.existsSync("dist")) {
	fs.mkdirSync("dist", { recursive: true });
}

// Copy styles.css
copyFileSync("src/styles.css", "dist/styles.css");

// Copy fonts directory
copyFolderRecursiveSync("src/fonts", "dist");

console.log("Build CSS completed successfully");
