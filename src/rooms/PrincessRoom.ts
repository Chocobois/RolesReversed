import { GameScene } from '../scenes/GameScene';
import { Room } from './Room';
import { Button } from '@/components/Button';
import { Notification } from '@/components/RoomButton';

enum PrincessState {
	Idle = 1,
	Sleeping = 2,
	Escaping = 3,
	Fled = 4,
}

export class PrincessRoom extends Room {
	public background: Phaser.GameObjects.Image;
	public princessButton: Button;
	public princessImage: Phaser.GameObjects.Image;

	private princessState: PrincessState;
	private timer: Phaser.Time.TimerEvent;

	constructor(scene: GameScene) {
		super(scene);
		this.scene = scene;
		this.scene.add.existing(this);

		this.background = scene.add.image(scene.CX, scene.CY, 'room_princess');
		this.add(this.background);
		scene.fitToScreen(this.background);

		this.princessButton = new Button(scene, scene.CX, scene.CY);
		this.add(this.princessButton);

		this.princessImage = scene.add.image(0, 0, 'princess_default');
		this.princessImage.setOrigin(0.5, 1.0);
		this.princessButton.add(this.princessImage);
		this.princessButton.bindInteractive(this.princessImage, false);
		this.princessButton.on('click', this.onPrincessClick, this);

		this.timer = this.scene.time.addEvent({
			delay: 3000,
			callback: this.movementOpportunity,
			callbackScope: this,
			paused: true,
		});

		this.setPrincessState(PrincessState.Sleeping);
	}

	update(time: number, delta: number) {
		const princessHoldX = 1.0 + 0.15 * this.princessButton.holdSmooth;
		const princessHoldY = 1.0 - 0.1 * this.princessButton.holdSmooth;
		const princessSquish = 0.02;
		this.princessButton.setScale((1.0 + princessSquish * Math.sin(time / 200)) * princessHoldX, (1.0 + princessSquish * Math.sin(-time / 200)) * princessHoldY);
	}

	setVisible(isShown: boolean): this {
		if (isShown) {
			if (this.timer) {
				this.timer.paused = true;
			}
		} else {
			if (this.timer.paused) {
				this.timer.paused = false;
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

	// The player is not looking and the princess may perform an action
	movementOpportunity() {
		function chance(odds: number) {
			return Math.random() < odds;
		}

		switch (this.princessState) {
			case PrincessState.Idle:
				if (chance(0.5)) {
					this.setPrincessState(PrincessState.Escaping);
				} else if (chance(0.5)) {
					this.setPrincessState(PrincessState.Sleeping);
				} else {
					this.setPrincessState(PrincessState.Idle); // Resets timer and image
				}
				break;

			case PrincessState.Sleeping:
				if (chance(0.5)) {
					this.setPrincessState(PrincessState.Idle);
				} else {
					this.setPrincessState(PrincessState.Sleeping); // Resets timer and image
				}
				break;

			case PrincessState.Escaping:
				this.setPrincessState(PrincessState.Fled);
				this.scene.endGame();
				break;
		}
	}

	setPrincessState(state: PrincessState) {
		this.princessState = state;

		switch (this.princessState) {
			case PrincessState.Idle:
				let texture1 = Phaser.Math.RND.pick(['princess_default', 'princess_plead', 'princess_stare']);
				this.princessButton.setPosition(960, 800);
				this.princessImage.setTexture(texture1);
				this.setTimer(3000);
				break;
			case PrincessState.Sleeping:
				let texture2 = Phaser.Math.RND.pick(['princess_laying', 'princess_laying_2', 'princess_laying_3']);
				this.princessImage.setTexture(texture2);
				this.princessButton.setPosition(1500, 730);
				this.setTimer(3000);
				break;
			case PrincessState.Escaping:
				this.princessImage.setTexture('princess_escape_1');
				this.princessButton.setPosition(1080, 500);
				this.setTimer(10000);
				break;
			case PrincessState.Fled:
				this.princessButton.setVisible(false);
				this.princessImage.setVisible(false);
				break;
			default:
				break;
		}

		if (this.roomButton) {
			switch (this.princessState) {
				case PrincessState.Escaping:
					this.roomButton.setNotification(Notification.Danger);
					break;
				default:
					this.roomButton.setNotification(Notification.Calm);
			}
		}
	}

	onPrincessClick() {
		if (this.princessState == PrincessState.Escaping) {
			this.setPrincessState(PrincessState.Idle);
			this.scene.sound.play('CAPTURE_SOUND', { volume: 0.1 });
			this.princessImage.setTexture('princess_plead');
			this.timer.paused = true;
		}
	}

	/* Debug */
	getDebugText() {
		const getStateText = () => {
			switch (this.princessState) {
				case PrincessState.Idle:
					return 'Idle';
				case PrincessState.Sleeping:
					return 'Sleeping';
				case PrincessState.Escaping:
					return 'Escaping';
				case PrincessState.Fled:
					return 'Fled';
				default:
					return 'Unknown';
			}
		};

		let remaining = Math.ceil(this.timer.getRemaining() / 1000) + 's';
		let paused = this.timer.paused ? ' paused' : '';
		return `Princess: ${getStateText()} (${remaining}${paused})`;
	}
}
