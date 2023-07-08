import { GameScene } from '../scenes/GameScene';
import { Message } from './Conversations';
import { RoundRectangle } from './RoundRectangle';
import { Button } from '@/components/Button';

export class DialogueBubble extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private border: RoundRectangle;
	private background: RoundRectangle;
	private text: Phaser.GameObjects.Text;

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

		this.border = new RoundRectangle(scene, 0, 0, this.width + border, 100 + border, radius, 0x000000);
		this.add(this.border);

		this.background = new RoundRectangle(scene, 0, 0, this.width, 100, radius - border / 2, 0xffffff);
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
