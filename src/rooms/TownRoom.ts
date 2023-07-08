import { GameScene } from "../scenes/GameScene";
import { Room } from './Room';

export class TownRoom extends Room {
	public background: Phaser.GameObjects.Image;

	constructor(scene: GameScene) {
		super(scene);
		this.scene = scene;
		this.scene.add.existing(this);

		this.background = scene.add.image(scene.CX, scene.CY, 'room_town');
		this.add(this.background);
		scene.fitToScreen(this.background);
	}

	update(time: number, delta: number) {}
}
