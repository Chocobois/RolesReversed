import { defineConfig } from 'vite'
import zip from 'vite-plugin-zip-pack';
import { execSync } from 'child_process';
import checker from 'vite-plugin-checker'
import tsconfigPaths from 'vite-tsconfig-paths'
import getGitVersion from './automation/git-version';
import buildMacApp from './automation/mac-bundle';
import buildWinApp from './automation/win-bundle';
import { title } from './game.json';
import WriteNeuConfig from './automation/write-neu-config';

const CheckerConfig = {
	terminal: true,
	overlay: true,
};

export default defineConfig({
	base: './',
	root: 'src',
	plugins: [
		tsconfigPaths(),
		getGitVersion(),
		checker({
			typescript: true,
			...CheckerConfig,
		}),
		{
			name: 'neu-build',
			apply: 'build',
			closeBundle() {
				console.log('Building standalone app');
				WriteNeuConfig();
				execSync('neu build --release');
			},
		},
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
