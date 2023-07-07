import { GameScene } from '../scenes/GameScene';
import { Button } from './Button';
import State from './State';

export class RoomButton extends Button {
	private image: Phaser.GameObjects.Image;
	private border: Phaser.GameObjects.Image;
	private text: Phaser.GameObjects.Text;

	private room: State;
	private size: number;

	constructor(scene: GameScene, x: number, y: number, key: string, room: State) {
		super(scene, x, y);
		this.room = room;

		this.size = 0.15 * this.scene.H;

		this.image = this.scene.add.image(0, 0, key);
		this.image.setScale(this.size / this.image.width);
		this.add(this.image);

		this.border = this.scene.add.image(0, 0, 'button_ring_off');
		this.border.setScale(this.size / this.border.width);
		this.add(this.border);

		this.bindInteractive(this.image, false);
		// const inputPadding = 40 / this.image.scaleX;
		// this.image.input.hitArea.setTo(-inputPadding, -inputPadding, this.image.width+2*inputPadding, this.image.height+2*inputPadding);
	}

	update(time: number, delta: number) {
		this.setScale(1.0 - 0.1 * this.holdSmooth);
	}

	setRoom(room: State) {
		this.border.setTexture(room == this.room ? 'button_ring_on' : 'button_ring_off');
	}
}
