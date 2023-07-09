import { Button } from '@/components/Button';
import { GameScene } from '../scenes/GameScene';
import { Room } from './Room';
import State from '@/components/State';

export class OverworldRoom extends Room {
	private background: Phaser.GameObjects.Image;
	private foreground: Phaser.GameObjects.Image;

	private shopButton: Button;
	private shopImage: Phaser.GameObjects.Image;
	private townButton: Button;
	private townImage: Phaser.GameObjects.Image;

	constructor(scene: GameScene) {
		super(scene);
		this.scene = scene;
		this.scene.add.existing(this);

		this.background = scene.add.image(scene.CX, scene.CY, 'room_overworld_bg');
		this.add(this.background);
		scene.fitToScreen(this.background);

		this.shopButton = new Button(scene, 1430, 950);
		this.add(this.shopButton);
		this.shopImage = scene.add.image(0, 0, 'overworld_shop');
		this.shopImage.setOrigin(0.5, 1.0);
		this.shopButton.add(this.shopImage);
		this.shopButton.bindInteractive(this.shopImage, false);
		this.shopButton.on('click', () => {
			this.emit('changeRoom', State.Shop);
		});

		this.townButton = new Button(scene, 350, 600);
		this.add(this.townButton);
		this.townImage = scene.add.image(0, 0, 'overworld_town');
		this.townImage.setOrigin(0.5, 1.0);
		this.townButton.add(this.townImage);
		this.townButton.bindInteractive(this.townImage, false);
		this.townButton.on('click', () => {
			this.emit('changeRoom', State.Town);
		});

		this.foreground = scene.add.image(scene.CX, scene.CY, 'room_overworld_fg');
		this.add(this.foreground);
		scene.fitToScreen(this.foreground);
	}

	update(time: number, delta: number) {
		const shopHoldX = 1.0 + 0.1 * this.shopButton.holdSmooth;
		const shopHoldY = 1.0 - 0.05 * this.shopButton.holdSmooth;
		const shopSquish = 0.02;
		this.shopButton.setScale((1.0 + shopSquish * Math.sin(time / 200)) * shopHoldX, (1.0 + shopSquish * Math.sin(-time / 200)) * shopHoldY);

		const townHoldX = 1.0 + 0.1 * this.townButton.holdSmooth;
		const townHoldY = 1.0 - 0.05 * this.townButton.holdSmooth;
		const townSquish = 0.02;
		this.townButton.setScale((1.0 + townSquish * Math.sin(time / 200)) * townHoldX, (1.0 + townSquish * Math.sin(-time / 200)) * townHoldY);
	}
}
