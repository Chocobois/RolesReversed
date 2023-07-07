import { Button } from '@/components/Button';
import { GameScene } from '../scenes/GameScene';

enum PrincessState {
	Idle = 1,
	Sleeping = 2,
	Escaping = 3,
	Fled = 4,
}

export class PrincessRoom extends Phaser.GameObjects.Container {
	public scene: GameScene;

	public background: Phaser.GameObjects.Image;
	public princessButton: Button;
	public princessImage: Phaser.GameObjects.Image;

	private princessState: PrincessState;
	private timer: Phaser.Time.TimerEvent;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		this.scene = scene;
		this.scene.add.existing(this);

		this.background = scene.add.image(scene.CX, scene.CY, 'room_princess');
		this.add(this.background);
		scene.fitToScreen(this.background);

		this.princessButton = new Button(scene, scene.CX, scene.CY);
		this.add(this.princessButton);

		this.princessImage = scene.add.image(0, 0, 'princess_default');
		this.princessButton.add(this.princessImage);
		this.princessButton.bindInteractive(this.princessImage, false);
		this.princessButton.on("click", this.onPrincessClick, this);

		this.timer = this.scene.time.addEvent({
			delay: 3000,
			callback: this.movementOpportunity,
			callbackScope: this,
			paused: true,
		});

		this.setPrincessState(PrincessState.Idle);
	}

	update(time: number, delta: number) {
		this.princessButton.setScale(1.0 - 0.1 * this.princessButton.holdSmooth);
	}

	setVisible(isShown: boolean): this {
		if (isShown) {
			if (this.timer) {
				this.timer.paused = true;
			}
		} else {
			if (this.timer.paused) {
				this.timer.paused = false;
				this.setTimer(3000);
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
				if (chance(0.1)) {
					this.setPrincessState(PrincessState.Escaping);
					this.setTimer(10000);
					break;
				}

				if (chance(0.5)) {
					this.setPrincessState(PrincessState.Sleeping);
				}
				this.setTimer(3000);
				break;

			case PrincessState.Sleeping:
				if (chance(0.5)) {
					this.setPrincessState(PrincessState.Idle);
				}

				this.setTimer(3000);
				break;

			case PrincessState.Escaping:
				this.setPrincessState(PrincessState.Fled);
		}
	}

	setPrincessState(state: PrincessState) {
		this.princessState = state;

		switch (this.princessState) {
			case PrincessState.Idle:
				let texture1 = Phaser.Math.RND.pick(['princess_default', 'princess_plead', 'princess_stare']);
				this.princessButton.setPosition(this.scene.CX, this.scene.CY);
				this.princessImage.setTexture(texture1);
				break;
			case PrincessState.Sleeping:
				let texture2 = Phaser.Math.RND.pick(['princess_laying', 'princess_laying_2', 'princess_laying_3']);
				this.princessImage.setTexture(texture2);
				this.princessButton.setPosition(0.77 * this.scene.W, 0.47 * this.scene.H);
				break;
			case PrincessState.Escaping:
				this.princessImage.setTexture('princess_escape_1');
				this.princessButton.setPosition(0.64 * this.scene.W, 0.26 * this.scene.H);
				break;
			case PrincessState.Fled:
				this.princessButton.setVisible(false);
				this.princessImage.setVisible(false);
				break;
			default:
				break;
		}
	}

	onPrincessClick() {
		this.setPrincessState(PrincessState.Idle);
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

		let remaining = this.timer.paused ? 'paused' : (this.timer.getRemaining() / 1000).toFixed(1);

		return `Princess: ${getStateText()} (${remaining})`;
	}
}
