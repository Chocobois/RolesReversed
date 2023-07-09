import { BaseScene } from "../scenes/BaseScene";
import { Button } from '@/components/Button';
import HeroState from '@/components/HeroState';
import { DialogueKey } from '@/components/Conversations';
//[]

export class Hero extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	public bribeAmount: number;
	public courage: number;
	public isHorny: boolean;
	//0= FAILTEXT, 1= intimidate, 2= bribe, 3= flirt, 4= kill
	public dialogue: DialogueKey;
	public intro: DialogueKey;
	//how much difficulty increases when killed
	public reputation: number;
	//public enemyButton: Phaser.GameObjects.Image;

	//how long hero waits between states
	public patience: number;
	public heroSprite: string;
	public myState: HeroState;

	constructor(scene: BaseScene, x: number, y: number, sprite: string, heroType: number) {
		super(scene, x, y);
		this.scene = scene;
		scene.add.existing(this);

		this.heroSprite = sprite;
		this.myState = HeroState.QUEUED;
		switch (heroType) {
			case 0:
				this.bribeAmount = 5000;
				this.courage = 2;
				this.isHorny = false;
				this.reputation = 0.3;
				this.dialogue = DialogueKey.KnightText;
				this.intro = DialogueKey.KnightIntro;
				this.patience = 3000;
				this.heroSprite = 'hero_charming';
				break;
			case 1:
				this.bribeAmount = 5000;
				this.courage = 0;
				this.isHorny = false;
				this.reputation = 0.3;
				this.dialogue = DialogueKey.SquireText;
				this.intro = DialogueKey.SquireIntro;
				this.patience = 5000;
				this.heroSprite = 'hero_normal';
				break;
			case 2:
				this.bribeAmount = 500;
				this.courage = 2;
				this.isHorny = false;
				this.reputation = 0.3;
				this.dialogue = DialogueKey.sk8rText;
				this.intro = DialogueKey.sk8rIntro;
				this.patience = 3000;
				this.heroSprite = 'hero_skater';
				break;
			case 3:
				this.bribeAmount = 5000;
				this.courage = 2;
				this.isHorny = true;
				this.reputation = 0.3;
				this.dialogue = DialogueKey.ValentineText;
				this.intro = DialogueKey.ValentineIntro;
				this.patience = 2000;
				this.heroSprite = 'hero_charming';
				break;
			default:
				this.bribeAmount = 5000;
				this.courage = 2;
				this.isHorny = false;
				this.reputation = 0.3;
				this.dialogue = DialogueKey.KnightText;
				this.intro = DialogueKey.KnightIntro;
				this.patience = 3000;
				this.heroSprite = 'hero_normal';
				break;
		}
	}

	//move from queue
	setActiveEnemy() {}
}