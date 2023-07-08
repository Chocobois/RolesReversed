import { PluginOption } from 'vite';
import { team, name } from '../game.json';
import { mkdirSync, copyFileSync } from 'fs';

const BuildMacApp = () => {
	const teamId = team.toLowerCase().replace(/\s/gi, '-');
	const appId = name.toLowerCase().replace(/\s/gi, '-');
	const buildName = `${teamId}-${appId}`;

	const winDir = `./dist/${name}`;
	const buildPath = `./dist/${buildName}/`;

	mkdirSync(winDir);
	copyFileSync(`${buildPath}/${buildName}-win_x64.exe`, `${winDir}/${name}.exe`);
	copyFileSync(`${buildPath}/resources.neu`, `${winDir}/resources.neu`);
};

export default function buildWinApp() {
	return {
		name: 'Build Windows bundle',
		closeBundle: BuildMacApp,
	} as PluginOption;
}
