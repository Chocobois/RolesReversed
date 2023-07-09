import { defineConfig } from 'vite';

import zip from 'vite-plugin-zip-pack';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';
import getGitVersion from './automation/git-version';
import neuBuild from './automation/neu-build';
import buildMacApp from './automation/mac-bundle';
import buildWinApp from './automation/win-bundle';

import { title, team, description } from './game.json';

const CheckerConfig = {
	terminal: true,
	overlay: true,
};

export default () => {
	process.env.VITE_GAME_TITLE = title;
	process.env.VITE_GAME_TEAM = team;
	process.env.VITE_GAME_DESCRIPTION = description;

	return defineConfig({
		base: './',
		root: 'src',
		plugins: [
			tsconfigPaths(),
			getGitVersion(),
			checker({
				typescript: true,
				...CheckerConfig,
			}),
			neuBuild(),
			buildMacApp(),
			buildWinApp(),
			zip({
				inDir: './dist/unpacked',
				outDir: './dist',
				outFileName: 'game-web.zip',
			}),
			zip({
				inDir: `./dist/${title}`,
				outDir: './dist',
				pathPrefix: `${title}`,
				outFileName: 'game-win.zip',
			}),
		],
		build: {
			outDir: '../dist/unpacked',
			chunkSizeWarningLimit: 4096,
			assetsInlineLimit: 0,
			target: 'ES2022',
			minify: 'terser',
			terserOptions: {
				format: {
					comments: false,
				},
			},
		},
		server: {
			host: '127.0.0.1',
		},
	});
};
