import { GameScene } from '../scenes/GameScene';
import { Room } from './Room';
import { Button } from '@/components/Button';
import { Notification } from '@/components/RoomButton';

enum HeroState {
	Absent = 1,
	Arrived = 2,
	Speaking = 3,
	Dead = 4,
}

export class HeroRoom extends Room {
	public background: Phaser.GameObjects.Image;
	public heroButton: Button;
	public heroImage: Phaser.GameObjects.Image;

	private heroState: HeroState;
	private timer: Phaser.Time.TimerEvent;

	constructor(scene: GameScene) {
		super(scene);
		this.scene = scene;
		this.scene.add.existing(this);

		this.background = scene.add.image(scene.CX, scene.CY, 'room_outside');
		this.add(this.background);
		scene.fitToScreen(this.background);

		this.heroButton = new Button(scene, 0.2 * scene.W, 0.93 * scene.H);
		this.add(this.heroButton);

		this.heroImage = scene.add.image(0, 0, 'hero_default');
		this.heroImage.setOrigin(0.5, 1.0);
		this.heroButton.add(this.heroImage);
		this.heroButton.bindInteractive(this.heroImage, false);
		this.heroButton.on('click', this.onHeroClick, this);

		this.timer = this.scene.time.addEvent({
			delay: 0,
			callback: this.movementOpportunity,
			callbackScope: this,
			paused: true,
		});

		this.setHeroState(HeroState.Absent);
	}

	update(time: number, delta: number) {
		const heroHoldX = 1.0 + 0.15 * this.heroButton.holdSmooth;
		const heroHoldY = 1.0 - 0.1 * this.heroButton.holdSmooth;
		const heroSquish = 0.02;
		this.heroButton.setScale((1.0 + heroSquish * Math.sin(time / 200)) * heroHoldX, (1.0 + heroSquish * Math.sin(-time / 200)) * heroHoldY);
	}

	setVisible(isShown: boolean): this {
		if (isShown) {
			if (this.timer) {
				switch (this.heroState) {
					case HeroState.Absent:
						this.timer.paused = true;
						break;

					case HeroState.Arrived:
						this.setHeroState(HeroState.Speaking);
						break;
				}
			}
		} else {
			if (this.timer.paused) {
				this.timer.paused = false;
				// this.setTimer(3000);
			}
		}

		super.setVisible(isShown);
		return this;
	}

	setTimer(delay: number) {
		this.timer.reset({
			delay,
			callback: this.movementOpportunity,
			callbackScope: this,
		});
	}

	// The player is not looking and the hero may perform an action
	movementOpportunity() {
		function chance(odds: number) {
			return Math.random() < odds;
		}

		switch (this.heroState) {
			case HeroState.Absent:
				if (chance(0.1)) {
					this.setHeroState(HeroState.Arrived);
					break;
				}

				this.setHeroState(HeroState.Absent); // Resets timer and image
				break;

			case HeroState.Arrived:
				this.setHeroState(HeroState.Absent);
				break;

			case HeroState.Speaking:
				this.setHeroState(HeroState.Absent);
				break;
		}
	}

	setHeroState(state: HeroState) {
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
	}

	onHeroClick() {
		this.setHeroState(HeroState.Absent);
	}

	/* Debug */
	getDebugText() {
		const getStateText = () => {
			switch (this.heroState) {
				case HeroState.Absent:
					return 'Absent';
				case HeroState.Arrived:
					return 'Arrived';
				case HeroState.Speaking:
					return 'Speaking';
				default:
					return 'Unknown';
			}
		};

		let remaining = Math.ceil(this.timer.getRemaining() / 1000) + 's';
		let paused = this.timer.paused ? ' paused' : '';
		return `Hero: ${getStateText()} (${remaining}${paused})`;
	}
}
