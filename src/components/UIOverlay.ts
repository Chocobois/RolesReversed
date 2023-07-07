import { GameScene } from "@/scenes/GameScene";
import { RoomButton } from "@/components/RoomButton";
import State from "./State";

export class UIOverlay extends Phaser.GameObjects.Container {
	public scene: GameScene;

	// public background: Phaser.GameObjects.Image;
	public roomButton1: RoomButton;
	public roomButton2: RoomButton;
	public roomButton3: RoomButton;
	public roomButton4: RoomButton;
	public roomButton5: RoomButton;
	public roomButton6: RoomButton;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		this.scene = scene;
		this.scene.add.existing(this);

        // this.background = scene.add.image(scene.CX, scene.CY, "background5");
		// scene.fitToScreen(this.background);

		this.roomButton1 = new RoomButton(scene, scene.CX - 500, 0.9*scene.H);
		this.roomButton1.on("click", () => {
			this.emit("changeRoom", State.Princess);
		});

		this.roomButton2 = new RoomButton(scene, scene.CX - 300, 0.9*scene.H);
		this.roomButton2.on("click", () => {
			this.emit("changeRoom", State.Invader);
		});

		this.roomButton3 = new RoomButton(scene, scene.CX - 100, 0.9*scene.H);
		this.roomButton3.on("click", () => {
			this.emit("changeRoom", State.Treasure);
		});

		this.roomButton4 = new RoomButton(scene, scene.CX + 100, 0.9*scene.H);
		this.roomButton4.on("click", () => {
			this.emit("changeRoom", State.Shop);
		});

		this.roomButton5 = new RoomButton(scene, scene.CX + 300, 0.9*scene.H);
		this.roomButton5.on("click", () => {
			this.emit("changeRoom", State.Town);
		});

		this.roomButton6 = new RoomButton(scene, scene.CX + 500, 0.9*scene.H);
		this.roomButton6.on("click", () => {
			this.emit("changeRoom", State.Overworld);
		});
	}

	update(time: number, delta: number) {
		this.roomButton1.update(time, delta);
		this.roomButton2.update(time, delta);
		this.roomButton3.update(time, delta);
		this.roomButton4.update(time, delta);
		this.roomButton5.update(time, delta);
		this.roomButton6.update(time, delta);
	}
}
