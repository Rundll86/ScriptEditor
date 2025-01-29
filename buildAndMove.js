const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

const repository = "Rundll86.github.io";
const dirname = "script-editor";

const fulldirname = path.join("..", repository, dirname);

function copyFolderSync(src, dest) {
	fs.mkdirSync(dest, { recursive: true });
	const entries = fs.readdirSync(src, { withFileTypes: true });
	for (let entry of entries) {
		const srcPath = path.join(src, entry.name);
		const destPath = path.join(dest, entry.name);
		if (entry.isDirectory()) {
			copyFolderSync(srcPath, destPath);
		} else {
			fs.copyFileSync(srcPath, destPath);
		}
	}
};

if (!fs.existsSync(fulldirname)) {
	fs.mkdirSync(fulldirname);
};
child_process.spawnSync("yarn dist");
copyFolderSync("./dist", fulldirname);
copyFolderSync("./public", fulldirname);