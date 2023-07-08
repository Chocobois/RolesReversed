import { Button } from '@/components/Button';
import { GameScene } from '../scenes/GameScene';

enum HeroState {
	Absent = 1,
	Present = 2,
}

export class InvaderRoom extends Phaser.GameObjects.Container {
	public scene: GameScene;

	public background: Phaser.GameObjects.Image;
	public heroImage: Phaser.GameObjects.Image;

	private heroState: HeroState;
	private timer: Phaser.Time.TimerEvent;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		this.scene = scene;
		this.scene.add.existing(this);

		this.background = scene.add.image(scene.CX, scene.CY, 'room_outside');
		this.add(this.background);
		scene.fitToScreen(this.background);

		this.heroImage = scene.add.image(0.2 * scene.W, 0.75 * scene.H, 'hero_normal');
		this.add(this.heroImage);

		this.timer = this.scene.time.addEvent({
			delay: 0,
			callback: this.movementOpportunity,
			callbackScope: this,
			paused: true,
		});

		this.setHeroState(HeroState.Present);
	}

	update(time: number, delta: number) {}

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

		switch (this.heroState) {
			case HeroState.Absent:
				if (chance(0.1)) {
					this.setHeroState(HeroState.Present);
					this.setTimer(10000);
					break;
				}

				this.setTimer(5000);
				break;

			case HeroState.Present:
				this.setHeroState(HeroState.Absent);

				this.setTimer(5000);
				break;
		}
	}

	setHeroState(state: HeroState) {
		this.heroState = state;

		switch (this.heroState) {
			case HeroState.Absent:
				this.heroImage.setVisible(false);
				break;
			case HeroState.Present:
				this.heroImage.setVisible(true);
				this.heroImage.setTexture('hero_normal');
				break;
			default:
				break;
		}
	}

	/* Debug */
	getDebugText() {
		const getStateText = () => {
			switch (this.heroState) {
				case HeroState.Absent:
					return 'Absent';
				case HeroState.Present:
					return 'Present';
				default:
					return 'Unknown';
			}
		};

		let remaining = Math.ceil(this.timer.getRemaining() / 1000) + 's';
		return `Hero: ${getStateText()} (${remaining})`;
	}
}
