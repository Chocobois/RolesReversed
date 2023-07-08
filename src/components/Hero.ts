import { BaseScene } from "../scenes/BaseScene";
import { Button } from '@/components/Button';
import HeroState from '@/components/HeroState';

const DIALOGUE_0 = ["Surrender the princess, fiend.", "Meet your demise, lizard!", "My courage does not falter!", "I am above temptation.", "Disgusting beast!", "My flesh, it burns!"];
const DIALOGUE_1 = ["Bring m-me the princess!", "T-Take that!", "I-I'll be back! You'll see!", "M-maybe if... no, I can't!", "W-what are you talking about!", "N-no, please - GYAAHHHH! "];
const DIALOGUE_2 = ["Give me that fine girl, lowly creature.", "Poor and pathetic creature!", "I am flawlessly equipped.", "How...opulent... but this is temporary.", "I can get better for pocket change.", "Water, somebody- AAAHHH!"];
const DIALOGUE_3 = ["I am a warrior of love, bestow me my princess!", "You are SO ugly!", "Nothing can shake the bedrock of love!", "True love is priceless.", "Ooh, I partake... a dragon's love must be large.", "Ah, the flames of ecstasy!"];

export class Hero extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	public bribeAmount: number;
	public courage: number;
	public isHorny: boolean;
	//0= FAILTEXT, 1= intimidate, 2= bribe, 3= flirt, 4= kill
	public dialogue: string[]; 

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
		switch(heroType) {
			case 0:
				this.bribeAmount = 5000;
				this.courage = 2;
				this.isHorny = false;
				this.reputation = 0.1;
				this.dialogue = DIALOGUE_0;
				this.patience = 3000;
				break;
			case 1:
				this.bribeAmount = 5000;
				this.courage = 0;
				this.isHorny = false;
				this.reputation = 0.1;
				this.dialogue = DIALOGUE_1;
				this.patience = 5000;
				break;
			case 2:
				this.bribeAmount = 100;
				this.courage = 2;
				this.isHorny = false;
				this.reputation = 0.1;
				this.dialogue = DIALOGUE_2;
				this.patience = 3000;
				break;
			case 3:
				this.bribeAmount = 5000;
				this.courage = 2;
				this.isHorny = true;
				this.reputation = 0.1;
				this.dialogue = DIALOGUE_3;
				this.patience = 2000;
				this.heroSprite = 'hero_sleazy';
				break;				
			default:
				this.bribeAmount = 5000;
				this.courage = 2;
				this.isHorny = false;
				this.reputation = 0.1;
				this.dialogue = DIALOGUE_0;
				this.patience = 3000;
				break;
		}

	}

	//move from queue
	setActiveEnemy()
	{

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