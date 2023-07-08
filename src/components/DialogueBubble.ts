import { GameScene } from '../scenes/GameScene';
import { Message } from './Conversations';
import { RoundRectangle } from './RoundRectangle';
import { Button } from '@/components/Button';
import Triangle from 'phaser3-rex-plugins/plugins/triangle.js';

export class DialogueBubble extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private border: RoundRectangle;
	private background: RoundRectangle;
	private text: Phaser.GameObjects.Text;
	// https://english.stackexchange.com/q/379265
	private tailBorder: Triangle;
	private tailFill: Triangle;

	public smoothY: number;

	constructor(scene: GameScene, x: number, y: number, message: Message) {
		super(scene, x, y);
		this.scene = scene;
		this.scene.add.existing(this);

		this.width = 1000;
		const fontsize = 60;
		const padding = fontsize;
		const radius = 48;
		const border = 20;
		const tailScale = 1.6;
		const borderColor = 0x000000;
		const fillColor = 0xffffff;

		this.border = new RoundRectangle(scene, 0, 0, this.width + border, 100 + border, radius, borderColor);
		this.add(this.border);

		if (message.left !== message.right) {
			const direction = message.left ? -1 : +1;
			const height = fontsize * tailScale;
			const width = (3 / 4) * height;

			this.tailBorder = new Triangle(this.scene, (this.width / 2 + border) * direction, 0, width, height, borderColor);
			this.tailFill = new Triangle(this.scene, (this.width / 2) * direction, 0, width, height, fillColor);
			this.tailBorder.setScale(direction, 1);
			this.tailFill.setScale(direction, 1);
			this.add(this.tailBorder);
			this.add(this.tailFill);
		}

		this.background = new RoundRectangle(scene, 0, 0, this.width, 100, radius - border / 2, fillColor);
		this.add(this.background);

		this.text = scene.createText(0, 0, fontsize, message.color, message.text);
		this.text.setOrigin(0.5);
		this.text.setWordWrapWidth(this.width - padding);
		this.add(this.text);

		this.height = this.text.height + padding + border;
		this.border.setHeight(this.height);
		this.background.setHeight(this.height - border);

		this.smoothY = this.y;
	}

	update(time: number, delta: number) {
		this.y += (this.smoothY - this.y) / 10;
	}
}
