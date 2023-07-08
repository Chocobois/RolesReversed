import { GameScene } from '../scenes/GameScene';
import { Room } from './Room';
import { Button } from '@/components/Button';
import { Notification } from '@/components/RoomButton';
import { Hero } from '@/components/Hero';
import HeroState from '@/components/HeroState';

enum queueState {
	IDLE = 0,
	WAITING = 1,
	ACTIVE = 2,
	CLEARING = 3,
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

	constructor(scene: GameScene) {
		super(scene);
		this.scene = scene;
		this.scene.add.existing(this);

		this.background = scene.add.image(scene.CX, scene.CY, 'room_outside');
		this.add(this.background);
		scene.fitToScreen(this.background);

		//lumie note: keeping this since it's convenient and i'm very lazy and bad
		//this only holds the image for the current hero, the actual hero and states gets rotated out in the queue
		this.heroButton = new Button(scene, 0.2 * scene.W, 0.93 * scene.H);
		this.add(this.heroButton);

		this.heroImage = scene.add.image(0, 0, 'hero_normal');
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
	}

	update(time: number, delta: number) {
		const heroHoldX = 1.0 + 0.15 * this.heroButton.holdSmooth;
		const heroHoldY = 1.0 - 0.1 * this.heroButton.holdSmooth;
		const heroSquish = 0.02;
		if (this.cooldown > 0) {
			if (this.queueFlag == queueState.IDLE || this.queueFlag == queueState.WAITING) {
				this.cooldown -= delta;
			}
		}
		if (this.clock >= 0 && !this.pausefx) {
			this.clock -= delta;
		} else if (this.clock <= 0) {
			this.movementOpportunity();
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

	// The player is not looking and the hero may perform an action
	// lumie note: changing this so that the hero can perform actions so long as you haven't clicked
	checkHeroSpawn() {
		function chance(odds: number) {
			return Math.random() < odds;
		}
		//if idling state and no cooldown try to push a hero to the queue
		if (this.cooldown <= 0) {
			if (this.queueFlag == queueState.IDLE || this.queueFlag == queueState.WAITING) {
				if (chance(0.8)) {
					this.heroList.push(new Hero(this.scene, 0.2 * this.scene.W, 0.93 * this.scene.H, 'hero_normal', Math.floor(Math.random() * 4)));
					this.queueFlag = queueState.WAITING;

					//activate immediately if this is the FRONT hero in the queue
					if (this.heroList.length == 1) {
						this.activateHero();
					}
				}
			}
			this.cooldown = 1000 + 2000 / (1 + this.scene.difficulty);
		}
	}

	activateHero() {
		this.heroImage.setTexture(this.heroList[0].heroSprite);
		this.heroButton.setVisible(true);
		this.heroList[0].myState = HeroState.IDLE;
		this.setManualTimer(1000 + 6000 / (1 + this.scene.difficulty));
		this.pausefx = false;
	}

	movementOpportunity() {
		function chance(odds: number) {
			return Math.random() < odds;
		}
		switch (this.queueFlag) {
			case queueState.CLEARING:
				this.activateHero();
				this.queueFlag = queueState.WAITING;

			case queueState.WAITING:
				//this scene has an active hero so we don't push to the queue
				//set the hero to do actions
				this.queueFlag = queueState.ACTIVE;
				this.heroList[0].myState = HeroState.SPEAKING;
				this.cooldown = 1000 + 2000 / (1 + this.scene.difficulty);
				this.roomButton.setNotification(Notification.Danger);
				this.setManualTimer(1000 + 6000 / (1 + this.scene.difficulty));
				if (this.visible == true) {
					this.pausefx = true;
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
		this.heroList[0].myState = HeroState.CLEARED;
		this.heroButton.setVisible(false);
		this.heroList.shift();
		this.roomButton.setNotification(Notification.Calm);
		if (this.heroList.length > 0) {
			//short cooldown before next hero
			this.queueFlag = queueState.CLEARING;
			this.heroList[0].myState = HeroState.QUEUED;
			this.setManualTimer(750 + 750 / (1 + this.scene.difficulty));
			this.pausefx = false;
		} else {
			//hacky fix for now
			this.setManualTimer(999999999);
			this.pausefx = true;
			this.queueFlag = queueState.IDLE;
		}
		this.scene.sound.play('HIT_SOUND', { volume: 0.1 });
		this.scene.difficulty += this.heroList[0].reputation;
		this.cooldown = 1000 + 2000 / (1 + this.scene.difficulty);
		//this.currentHero = null;
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
		let qstate = 'Queue State: ' + this.queueFlag + ', ';
		let cd = 'Spawning cooldown: ' + Math.ceil(this.cooldown / 1000) + 's ,';

		let remaining = Math.ceil(this.clock / 1000) + 's';
		let paused = this.pausefx ? ' paused' : '';
		return `Hero: ${cd} ${qstate} ${queue} ${getStateText()}(${remaining}${paused})`;
	}
}
