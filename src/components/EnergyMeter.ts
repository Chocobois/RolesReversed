import { interpolateColor } from '@/assets/util';
import { GameScene } from '../scenes/GameScene';
import { RoundRectangle } from './RoundRectangle';
import State from './State';

const COLOR_GOLD = 0xffaa00;
const COLOR_HEALING = 0xffffff;
const COLOR_DANGER = 0xff0000;

export class EnergyMeter extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private border: RoundRectangle;
	private background: RoundRectangle;
	private foreground: RoundRectangle;
	private text: Phaser.GameObjects.Text;

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		this.scene = scene;
		this.scene.add.existing(this);

		// const fontsize = 60;
		const radius = 13;
		const border = 12;

		this.width = 150;
		this.height = radius / 2;
		this.y -= this.height;

		this.border = new RoundRectangle(scene, 0, 0, this.width + border, this.height + border, radius, 0x000000);
		this.add(this.border);

		this.background = new RoundRectangle(scene, 0, 0, this.width, this.height, radius - border / 2, 0x444444);
		this.add(this.background);

		this.foreground = new RoundRectangle(scene, 0, 0, this.width, this.height, radius - border / 2, 0xffaa00);
		this.add(this.foreground);

		// this.text = scene.createText(0, 0, fontsize, 'gold', '100/100');
		// this.text.setOrigin(0.5);
		// this.text.setWordWrapWidth(this.width - padding);
		// this.text.setVisible(false);
		// this.add(this.text);
	}

	update(time: number, delta: number) {
		// this.text.setText(`Gold: ${energy.toString()} / 100`);

		let ratio = this.scene.energy / this.scene.maxEnergy;
		this.foreground.setWidth(this.background.width * ratio);
		this.foreground.x = this.background.x - this.background.width / 2 + this.foreground.width / 2;

		let color = COLOR_GOLD;
		let anim = 0.5 + 0.5 * Math.sin(time / 100);
		if (this.scene.state == State.Treasure) {
			color = interpolateColor(COLOR_GOLD, COLOR_HEALING, anim);
		} else if (this.scene.energy < 20) {
			color = interpolateColor(COLOR_GOLD, COLOR_DANGER, anim);
		}
		this.foreground.setColor(color);
	}
}
