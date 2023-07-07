import { GameScene } from "../scenes/GameScene";
import { Button } from "./Button";

export class RoomButton extends Button {
	private image: Phaser.GameObjects.Image;
	private text: Phaser.GameObjects.Text;

	private size: number;

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		this.scene.add.existing(this);

		this.size = 0.15 * this.scene.H;

		this.image = this.scene.add.image(0, 0, "placeholder_ui_next");
		this.image.setScale(this.size / this.image.width);
		this.add(this.image);

		// this.text = this.scene.createText(0, 0, 60*this.scene.SCALE, "#111", "Click the tree to harvest it ");
		// this.text.setOrigin(0.5);
		// this.text.setStroke("#fff", 120 * this.scene.SCALE);
		// this.add(this.text);

		this.bindInteractive(this.image, true);
		// const inputPadding = 40 / this.image.scaleX;
		// this.image.input.hitArea.setTo(-inputPadding, -inputPadding, this.image.width+2*inputPadding, this.image.height+2*inputPadding);
	}

	update(time: number, delta: number) {
		this.setScale(1.0 - 0.1 * this.holdSmooth);
	}
}