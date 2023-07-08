import { execSync } from 'child_process';
import neuConf from './neu-template.json';
import { team, name } from '../game.json';
import { writeFileSync } from 'fs';

const count = execSync('git rev-list --count HEAD').toString().trim();

const teamId = team.toLowerCase().replace(/\s/gi, '-');
const appId = name.toLowerCase().replace(/\s/gi, '-');

neuConf.applicationId = `${teamId}.${appId}`;
neuConf.modes.window.title = `${team} - ${name}`;
neuConf.cli.binaryName = `${teamId}-${appId}`;
neuConf.version = `0.0.${count}`;

writeFileSync('neutralino.config.json', JSON.stringify(neuConf));

execSync('neu update', { stdio: 'inherit' });
