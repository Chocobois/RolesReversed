import { BaseScene } from './BaseScene';
import { MiniButton } from '@/components/MiniButton';
import { version } from '@/version.json';

export class PausedScene extends BaseScene {
	public title: Phaser.GameObjects.Text;
	public subtitle: Phaser.GameObjects.Text;
	public overlay: Phaser.GameObjects.Rectangle;

	private gameScene: Phaser.Scene;

	private muteMusicButton: MiniButton;
	private muteSoundButton: MiniButton;
	private pauseButton: MiniButton;

	constructor() {
		super({ key: 'PausedScene' });
	}

	create(): void {
		console.log('Paused');
		this.gameScene = this.scene.get('GameScene');

		this.overlay = this.add.rectangle(this.W / 2, this.H / 2, this.W, this.H, 0x3a1919, 0.4);
		this.overlay.setAlpha(0);

		this.title = this.createText(this.W / 2, this.H / 2, 180, 'white', 'Paused');
		this.title.setOrigin(0.5, 1);
		this.title.setStroke('black', 24);
		this.title.setAlpha(0);

		this.subtitle = this.createText(this.W / 2, this.H / 2, 60, 'white', 'Tap to resume');
		this.subtitle.setOrigin(0.5, 0);
		this.subtitle.setStroke('black', 16);
		this.subtitle.setAlpha(0);

		/* Transitions */

		this.tweens.add({
			targets: [this.overlay, this.title, this.subtitle],
			alpha: 1,
			ease: 'Cubic.Out',
			duration: 700,
		});

		/* Input */

		this.input.on('pointerdown', (pointer: PointerEvent) => {
			if (pointer.button == 0) {
				this.scene.resume('GameScene');
				console.log('Unpaused');

				this.input.enabled = false;

				this.tweens.add({
					targets: [this.overlay, this.title, this.subtitle],
					alpha: 0,
					ease: 'Cubic.Out',
					duration: 400,
					onComplete: () => this.scene.stop('PausedScene'),
				});
			} else console.log('Mouse button', pointer.button);
		});
	}

	update(time: number, delta: number) {
		const squish = 0.02;
		this.subtitle.setScale(1.0 + squish * Math.sin(time / 150), 1.0 + squish * Math.sin(-time / 150));
	}
}
