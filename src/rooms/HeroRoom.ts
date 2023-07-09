import { GameScene } from '../scenes/GameScene';
import { Room } from './Room';
import { Button } from '@/components/Button';
import { Notification } from '@/components/RoomButton';
import { Hero } from '@/components/Hero';
import HeroState from '@/components/HeroState';
import { DialogueKey } from '@/components/Conversations';

enum queueState {
	IDLE = 0,
	WAITING = 1,
	ACTIVE = 2,
	CLEARING = 3,
	DISPLAY = 4,
}

export class HeroRoom extends Room {
	public background: Phaser.GameObjects.Image;
	public heroButton: Button;
	public heroImage: Phaser.GameObjects.Image;

	//private heroState: HeroState;
	private timer: Phaser.Time.TimerEvent;

	private heroList: Hero[];

	private currentHero: Hero;

	//is the hero queue idling
	private queueFlag: queueState;
	//cooldown between adding heroes to queue
	//separate so that we can spawn heroes while there are already heroes
	private cooldown: number;
	private clock: number;
	private pausefx: boolean;
	private fryDifficulty: boolean;
	private bribeFlag: boolean;
	private pendingDialogue: boolean;
	private tutorialRead: boolean;
	private animMode: boolean;
	private animFrames: number;

	constructor(scene: GameScene) {
		super(scene);
		this.scene = scene;
		this.scene.add.existing(this);

		this.background = scene.add.image(scene.CX, scene.CY, 'room_outside');
		this.add(this.background);
		scene.fitToScreen(this.background);

		//lumie note: keeping this since it's convenient and i'm very lazy and bad
		//this only holds the image for the current hero, the actual hero and states gets rotated out in the queue
		this.heroButton = new Button(scene, 0.13 * scene.W, 0.75 * scene.H);
		this.add(this.heroButton);

		this.heroImage = scene.add.image(0, 0, 'hero_big');
		this.heroImage.setOrigin(0.5, 1.0);
		this.heroButton.add(this.heroImage);
		this.heroButton.bindInteractive(this.heroImage, false);
		this.heroButton.on('click', this.onHeroClick, this);

		this.timer = this.scene.time.addEvent({
			delay: 999999,
			callback: this.movementOpportunity,
			callbackScope: this,
			paused: true,
		});
		this.heroButton.setVisible(false);
		this.queueFlag = queueState.IDLE;
		this.heroList = [];
		this.cooldown = 3000;
		this.clock = 9999999999999999;
		this.pausefx = true;
		this.fryDifficulty = false;
		this.bribeFlag = false;
		this.pendingDialogue = false;
		this.tutorialRead = false;
		this.heroButton.setVisible(false);
		this.animMode = false;
		this.animFrames = 0;
		const expl = {
			key: 'explosion',
			frames: 'explosion_tiny',
			frameRate: 12,
			showOnStart: true,
			hideOnComplete: true
		};

		this.scene.anims.create(expl);

		this.startTutorial();
	}

	update(time: number, delta: number) {
		if (this.scene.dialogueFlag) {
			return;
		}
		const heroHoldX = 1.0; //+ 0.15 * this.heroButton.holdSmooth;
		const heroHoldY = 1.0; //- 0.1 * this.heroButton.holdSmooth;
		const heroSquish = 0.02;
		if (this.cooldown > 0 && this.tutorialRead) {
			if (this.queueFlag == queueState.IDLE || this.queueFlag == queueState.WAITING) {
				this.cooldown -= delta;
			}
		}
		if (this.clock >= 0 && !this.pausefx) {
			this.clock -= delta;
		} else if (this.clock <= 0 && !(this.queueFlag == queueState.DISPLAY)) {
			this.movementOpportunity();
		}

		if(this.animMode)
		{
			this.animFrames -= delta;
			this.processDisplayMode();
		}
		this.checkHeroSpawn();
		this.heroButton.setScale((1.0 + heroSquish * Math.sin(time / 200)) * heroHoldX, (1.0 + heroSquish * Math.sin(-time / 200)) * heroHoldY);
	}

	setVisible(isShown: boolean): this {
		if (isShown) {
			if (this.clock >= 0) {
				if (this.queueFlag == queueState.ACTIVE) {
					this.pausefx = true;
				}
			}
		} else {
			if (this.pausefx) {
				this.pausefx = false;
				// this.setTimer(3000);
			}
		}
		super.setVisible(isShown);
		if (isShown && this.pendingDialogue) {
			this.scene.startDialogue(this.heroList[0].intro, (flags) => {});
			this.pendingDialogue = false;
		}
		return this;
	}

	setManualTimer(time: number) {
		this.clock = time;
	}

	setTimer(delay: number) {
		this.timer.reset({
			delay,
			callback: this.movementOpportunity,
			callbackScope: this,
		});
	}

	startTutorial() {
		this.queueFlag = queueState.CLEARING;
		this.heroList.push(new Hero(this.scene, 0.13 * this.scene.W, 0.75 * this.scene.H, 'hero_big', 999));
		this.heroList[0].myState = HeroState.QUEUED;
		this.setManualTimer(3000);
		this.pausefx = false;
	}

	// The player is not looking and the hero may perform an action
	// lumie note: changing this so that the hero can perform actions so long as you haven't clicked
	checkHeroSpawn() {
		function chance(odds: number) {
			return Math.random() < odds;
		}
		//if idling state and no cooldown try to push a hero to the queue
		if (this.cooldown <= 0 && this.tutorialRead) {
			if (this.queueFlag == queueState.IDLE || this.queueFlag == queueState.WAITING) {
				if (chance(0.8)) {
					this.heroList.push(new Hero(this.scene, 0.15 * this.scene.W, 0.88 * this.scene.H, 'hero_normal', Math.floor(Math.random() * 4)));
					this.queueFlag = queueState.WAITING;

					//activate immediately if this is the FRONT hero in the queue
					if (this.heroList.length == 1) {
						this.activateHero();
					}
				}
			}
			this.cooldown = 5000 + 2000 / (1 + this.scene.difficulty);
		}
	}

	activateHero() {
		this.heroImage.setTexture(this.heroList[0].heroSprite);
		this.heroImage.setAlpha(1);
		this.heroButton.setVisible(true);
		this.heroButton.enabled = true;
		this.heroList[0].myState = HeroState.IDLE;
		this.pausefx = false;
		this.roomButton.setNotification(Notification.Question);
		this.setManualTimer(1000 + 6000 / (1 + this.scene.difficulty));
	}

	movementOpportunity() {
		function chance(odds: number) {
			return Math.random() < odds;
		}
		switch (this.queueFlag) {
			case queueState.CLEARING:
				this.activateHero();
				if(!this.tutorialRead) {
					this.pendingDialogue = true;
				}
				this.queueFlag = queueState.WAITING;
				return;
			case queueState.WAITING:
				//this scene has an active hero so we don't push to the queue
				//set the hero to do actions
				this.queueFlag = queueState.ACTIVE;
				this.heroList[0].myState = HeroState.SPEAKING;
				this.roomButton.setNotification(Notification.Danger);
				this.setManualTimer(!this.tutorialRead? 999999999999 : (1000 + 6000 / (1 + this.scene.difficulty)));
				if (this.visible == true) {
					this.pausefx = true;
				}
				if (this.tutorialRead) {
					this.pendingDialogue = true;
				}
				return;
			case queueState.ACTIVE:
				if (this.heroList[0].myState == HeroState.SPEAKING) {
					this.heroList[0].myState = HeroState.SELECTED;
					this.setManualTimer(1000 + 6000 / (1 + this.scene.difficulty));
					return;
				} else if (this.heroList[0].myState == HeroState.SELECTED) {
					this.scene.endGame();
				}
				return;
		}
	}

	setHeroState(state: HeroState) {
		/*
		this.heroState = state;

		switch (this.heroState) {
			case HeroState.Absent:
				this.heroImage.setVisible(false);
				this.setTimer(5000);
				break;
			case HeroState.Arrived:
				this.heroImage.setVisible(true);
				this.heroImage.setTexture('hero_normal');
				this.setTimer(10000);
				break;
			case HeroState.Speaking:
				this.setTimer(30000);
				break;
			default:
				break;
		}

		if (this.roomButton) {
			switch (this.heroState) {
				case HeroState.Arrived:
					this.roomButton.setNotification(Notification.Danger);
					break;
				default:
					this.roomButton.setNotification(Notification.Calm);
			}
		}
		*/
	}

	onHeroClick() {
		this.scene.startDialogue(this.heroList[0].dialogue, (flags) => {
			if (flags.tutorial) {
				this.tutorialRead = true;
			}
			if (flags.talkFailure) {
				this.scene.endGame();
				return;
			} else if (flags.fried) {
				this.fryDifficulty = true;
				this.scene.sound.play('FRIED_SOUND', { volume: 0.25 });
				this.scene.sound.play('SCREAM', { volume: 0.1 });
				this.advance(true);
				//this.scene.difficulty += this.heroList[0].reputation;
			} else if (flags.payBribe) {
				this.bribeFlag = true;
				this.scene.sound.play('HIT_SOUND', { volume: 0.1 });
				this.advance(false);
			} else {
				this.scene.sound.play('HIT_SOUND', { volume: 0.1 });
				this.advance(false);
			}
		});
	}

	advance(fried: boolean)
	{
		if (this.fryDifficulty) {
			this.scene.difficulty += this.heroList[0].reputation;
			this.fryDifficulty = false;
		}
		if (this.bribeFlag) {
			this.scene.addEnergy(-1 * (this.heroList[0].bribeAmount / 10));
			this.bribeFlag = false;
		}
		if(fried) {
			let xpl = this.scene.add.sprite(this.heroButton.x+50, this.heroButton.y-240, 'explosion');
			xpl.play({key: 'explosion', delay: 0});
			this.heroImage.setTexture('hero_ash');
		}
		this.pendingDialogue = false;
		this.heroList[0].myState = HeroState.CLEARED;
		this.animMode = true;
		this.animFrames = 1000;
		this.queueFlag = queueState.DISPLAY;
		this.heroButton.enabled = false;
	}

	//manage when hero exploding
	processDisplayMode()
	{
		if(this.animFrames <= 0)
		{
			this.animMode = false;
			this.advanceHeroQueue();
		}
		this.heroImage.setAlpha(this.animFrames/1000);
	}

	advanceHeroQueue() {
		this.heroButton.setVisible(false);
		this.heroImage.setAlpha(1);
		this.heroList.shift();
		this.roomButton.setNotification(Notification.Calm);
		if (this.heroList.length > 0) {
			//short cooldown before next hero
			this.queueFlag = queueState.CLEARING;
			this.heroList[0].myState = HeroState.QUEUED;
			this.heroImage.setTexture(this.heroList[0].heroSprite);
			this.setManualTimer(12000 + 750 / (1 + this.scene.difficulty));
			this.pausefx = false;
		} else {
			//hacky fix for now
			this.setManualTimer(999999999);
			this.pausefx = true;
			this.queueFlag = queueState.IDLE;
		}
		this.cooldown = 5000 + 2000 / (1 + this.scene.difficulty);
	}

	/* Debug */
	getDebugText() {
		const getStateText = () => {
			if (this.heroList.length > 0) {
				switch (this.heroList[0].myState) {
					case HeroState.QUEUED:
						return 'Arriving';
					case HeroState.IDLE:
						return 'Waiting';
					case HeroState.SPEAKING:
						return 'Speaking';
					case HeroState.SELECTED:
						return 'ACTing';
					case HeroState.CLEARED:
						return 'Defeated';
				}
			} else {
				return 'Absent';
			}
			return 'Unknown';
		};

		let queue = 'In queue: ' + this.heroList.length + ', ';
		let qstate = '';
		switch (this.queueFlag) {
			case queueState.IDLE:
				qstate = 'Queue State: IDLE, ';
				break;
			case queueState.ACTIVE:
				qstate = 'Queue State: ACTIVE, ';
				break;
			case queueState.CLEARING:
				qstate = 'Queue State: CLEARING, ';
				break;
			case queueState.WAITING:
				qstate = 'Queue State: WAITING, ';
				break;
			case queueState.DISPLAY:
				qstate = 'Queue State: DISPLAY, ';
				break;
			default:
				qstate = 'Queue State: UNKNOWN, ';
				break;
		}
		let cd = 'Spawning cooldown: ' + Math.ceil(this.cooldown / 1000) + 's ,';

		let remaining = Math.ceil(this.clock / 1000) + 's';
		let paused = this.pausefx ? ' paused' : '';
		let anims = '';
		if(this.animMode) {
			anims = ' Remaining frames: ' + this.animFrames; 
		}
		return `Hero: ${cd} ${qstate} ${queue} ${getStateText()}(${remaining}${paused})${anims}`;
	}
}
