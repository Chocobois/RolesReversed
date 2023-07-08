import { PluginOption } from 'vite';
import { team, name } from '../game.json';
import { execSync } from 'child_process';
import { mkdirSync, writeFileSync, copyFileSync, renameSync } from 'fs';

const BuildMacApp = () => {
	const count = execSync('git rev-list --count HEAD').toString().trim();
	const short = execSync('git rev-parse --short HEAD').toString().trim();
	const version = `v${count}.${short}`;

	const teamId = team.toLowerCase().replace(/\s/gi, '-');
	const appId = name.toLowerCase().replace(/\s/gi, '-');
	const buildName = `${teamId}-${appId}`;

	const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>NSHumanReadableCopyright</key>
  <string>${name} ${version} © ${team}</string>
  <key>CFBundleExecutable</key>
  <string>game</string>
  <key>CFBundleIdentifier</key>
  <string>com.${teamId}.${appId}</string>
  <key>CFBundleName</key>
  <string>${name}</string>
  <key>CFBundleIconFile</key>
  <string>icon.png</string>
  <key>CFBundleShortVersionString</key>
  <string>0.${count}</string>
  <key>CFBundleInfoDictionaryVersion</key>
  <string>6.0</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>IFMajorVersion</key>
  <integer>0</integer>
  <key>IFMinorVersion</key>
  <integer>${count}</integer>
</dict>
</plist>`;

	mkdirSync(`./dist/mac/`);

	const root = `./dist/mac/${name}`;
	const buildPath = `./dist/${buildName}/`;

	mkdirSync(root);
	mkdirSync(`${root}/Contents`);
	mkdirSync(`${root}/Contents/MacOS`);
	mkdirSync(`${root}/Contents/Resources`);

	writeFileSync(`${root}/Contents/info.plist`, plist);
	copyFileSync(`${buildPath}/${buildName}-mac_universal`, `${root}/Contents/MacOS/game`);
	copyFileSync(`${buildPath}/resources.neu`, `${root}/Contents/MacOS/resources.neu`);
	copyFileSync(`./src/public/icon.png`, `${root}/Contents/Resources/icon.png`);
	renameSync(root, `${root}.app`);

	try {
		execSync(`mkisofs -J -R -o ./dist/game.dmg -mac-name -V DmgLabel -apple -v -dir-mode 777 -file-mode 777 "./dist/mac/"`, { stdio: 'inherit' });
	} catch (err) {
		console.log(`Can't build dmg`);
	}
};

export default function buildMacApp() {
	return {
		name: 'Build Mac bundle',
		closeBundle: BuildMacApp,
	} as PluginOption;
}
