import { GameScene } from "../scenes/GameScene";

export class PrincessRoom extends Phaser.GameObjects.Container {
	public scene: GameScene;

	public background: Phaser.GameObjects.Image;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		this.scene = scene;
		this.scene.add.existing(this);

        this.background = scene.add.image(scene.CX, scene.CY, 'room_princess');
		this.add(this.background);
		scene.fitToScreen(this.background);
	}

	update(time: number, delta: number) {
	}
}
