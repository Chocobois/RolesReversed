import { BaseScene } from "../scenes/BaseScene";
import { Button } from '@/components/Button';

export class Enemy extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	public bribeAmount: number;
	public courage: number;
	public isHorny: boolean;

	//0= FAILTEXT, 1= intimidate, 2= bribe, 3= flirt, 4= kill
	public dialogue: string[]; 

	//how much difficulty increases when killed
	public reputation: number;

	//public enemyButton: Phaser.GameObjects.Image;
	public enemySprite: string;

	constructor(scene: BaseScene, x: number, y: number, sprite: string, bribe: number, courage: number, horniness: boolean, rep: number, text: string[]) {
		super(scene, x, y);
		this.scene = scene;
		scene.add.existing(this);

		this.enemySprite = sprite;
		this.bribeAmount = bribe;
		this.courage = courage;
		this.isHorny = horniness;
		this.reputation = rep;
		this.dialogue = text;
	}

	selectDialogue(input: number, value: number)
	{
		switch(input)
		{
			case 0:
				return this.dialogue[input];
			case 1:
				if(value > this.courage){
					this.courage++;
					return this.dialogue[input];
				}
			case 2:
				if(value > this.bribeAmount) {
					this.bribeAmount*=1.1;
					return this.dialogue[input];
				}
			case 3:
				if(this.isHorny){
					return this.dialogue[input];
				}
			case 4:
				return this.dialogue[input];
			default:
				return this.dialogue[0];

		}
	}

	

}