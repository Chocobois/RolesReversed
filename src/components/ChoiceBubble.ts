import { colorToNumber } from '@/assets/util';
import { GameScene } from '../scenes/GameScene';
import { Choice, Message, VoiceClips } from './Conversations';
import { RoundRectangle } from './RoundRectangle';
import { Button } from '@/components/Button';
import Triangle from 'phaser3-rex-plugins/plugins/triangle.js';

export class ChoiceBubble extends Button {
	public scene: GameScene;

	private border: RoundRectangle;
	private background: RoundRectangle;
	private text: Phaser.GameObjects.Text;

	public smoothY: number;
	public isLatestMessage: boolean;

	constructor(scene: GameScene, x: number, y: number, width: number, choice: Choice) {
		super(scene, x, y);
		this.scene = scene;
		this.scene.add.existing(this);

		this.width = width;
		const fontsize = 60;
		const padding = fontsize;
		const radius = 48;
		const border = 20;
		const borderColor = 0xffffff;
		const fillColor = colorToNumber(choice.color);

		this.border = new RoundRectangle(scene, 0, 0, this.width + border, 100 + border, radius, borderColor);
		this.add(this.border);

		this.background = new RoundRectangle(scene, 0, 0, this.width, 100, radius - border / 2, fillColor);
		this.add(this.background);

		this.text = scene.createText(0, 0, fontsize, 'white', choice.text);
		this.text.setOrigin(0.5);
		this.text.setWordWrapWidth(this.width - padding);
		this.add(this.text);

		this.height = this.text.height + padding + border;
		this.border.setHeight(this.height);
		this.background.setHeight(this.height - border);

		this.smoothY = this.y;
		this.isLatestMessage = true;

		this.bindInteractive(this.border, false);
	}

	update(time: number, delta: number) {
		this.y += (this.smoothY - this.y) / 10;
		let squish = this.enabled ? 0.02 : 0;
		this.setScale(1.0 - 0.1 * this.holdSmooth + squish * Math.sin(time / 100));
	}

	highlight() {
		this.border.setColor(0xffffff);
	}
}
