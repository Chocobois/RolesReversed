import { BaseScene } from "./BaseScene";
import { Music } from "@/components/Music";

export class GameScene extends BaseScene {
	public background: Phaser.GameObjects.Image;

    public state: number;


	constructor() {
        console.log("GameScene constructor");
		super({key: "GameScene"});
	}

	create(): void {
        console.log("GameScene create");
		this.fade(false, 200, 0x000000);

		this.background = this.add.image(this.CX, 0.9*this.CY, "title_background");
		this.containToScreen(this.background);
	}

	update(time: number, delta: number) {
	}
}