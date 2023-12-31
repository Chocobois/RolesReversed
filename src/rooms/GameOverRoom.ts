import { Button } from '@/components/Button';
import { GameScene } from '../scenes/GameScene';
import { Room } from './Room';

export class GameOverRoom extends Room {
	//we can add restart buttons and such here
	public scene: GameScene;

	public background: Phaser.GameObjects.Image;
	public restartText: Phaser.GameObjects.Text;
	public restartButton: Button;
	public musicPlaying: boolean;

	constructor(scene: GameScene) {
		super(scene);
		this.scene = scene;
		this.scene.add.existing(this);
		this.musicPlaying = false;

		this.background = scene.add.image(scene.CX, scene.CY, 'game_over');
		this.add(this.background);
		scene.fitToScreen(this.background);

		this.restartButton = new Button(this.scene, this.scene.CX, this.scene.CY);
		this.add(this.restartButton);

		this.restartText = scene.createText(0, 0, 100, '#FFFFFF', 'Restart');
		this.restartText.setOrigin(0.5);
		this.restartText.setStroke('#000', 16);
		this.restartButton.add(this.restartText);
		this.restartButton.bindInteractive(this.restartText);
		this.restartButton.on('click', () => {
			this.scene.sound.stopByKey('s_gameover');
			this.musicPlaying = false;
			console.log('Stopping gameover music');
			this.scene.scene.start('TitleScene');
		});
	}

	update(time: number, delta: number) {
		if (this.visible && !this.musicPlaying) {
			this.scene.sound.play('s_gameover', { volume: 0.25 });
			this.musicPlaying = true;
			console.log('Playing gameover music');
		}
	}
}
