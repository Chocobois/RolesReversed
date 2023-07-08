import { BaseScene } from "../scenes/BaseScene";
import { Button } from '@/components/Button';

export class Enemy extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	public bribeAmount: number;
	public courage: number;
	public isHorny: boolean;

	public dialogue: string[]; 
	public enemyButton: Button;
	public enabled: boolean;

	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);
		this.scene = scene;
		scene.add.existing(this);
	}

	

}