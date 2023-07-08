import { Button } from '@/components/Button';
import { GameScene } from '../scenes/GameScene';
import { Room } from './Room';

export class TreasureRoom extends Room {
	private background: Phaser.GameObjects.Image;
	private dragonButton: Button;
	private dragonImage: Phaser.GameObjects.Image;

	constructor(scene: GameScene) {
		super(scene);
		this.scene = scene;
		this.scene.add.existing(this);

		this.background = scene.add.image(scene.CX, scene.CY, 'room_sleep');
		this.add(this.background);
		scene.fitToScreen(this.background);

		this.dragonButton = new Button(scene, 1230, 860);
		this.add(this.dragonButton);

		this.dragonImage = scene.add.image(0, 0, 'dragon_sleep');
		this.dragonImage.setOrigin(0.5, 0.9);
		this.dragonButton.add(this.dragonImage);

		this.dragonButton.bindInteractive(this.dragonImage);
	}

	update(time: number, delta: number) {
		if (this.visible) {
			let holdX = 1.0 + 0.03 * this.dragonButton.holdSmooth;
			let holdY = 1.0 - 0.06 * this.dragonButton.holdSmooth;
			let squish = 0.02;
			let speed = 200;

			if (this.scene.energy < 30) {
				this.dragonImage.setTexture('dragon_sleep_low');
				speed = 150;
			} else if (this.scene.energy > 70) {
				this.dragonImage.setTexture('dragon_sleep_high');
				speed = 400;
			} else {
				this.dragonImage.setTexture('dragon_sleep');
			}

			this.dragonButton.setScale((1.0 + squish * Math.sin(time / speed)) * holdX, (1.0 + squish * Math.sin(-time / speed)) * holdY);
		}
	}

	/* Debug */
	getDebugText() {
		return `Energy: ${this.scene.energy.toFixed(0)} / ${this.scene.maxEnergy}`;
	}
}
