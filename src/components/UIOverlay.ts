import { GameScene } from '@/scenes/GameScene';
import { RoomButton } from '@/components/RoomButton';
import State from './State';
import { MiniButton } from './MiniButton';
import { EnergyMeter } from './EnergyMeter';

export class UIOverlay extends Phaser.GameObjects.Container {
	public scene: GameScene;

	// public background: Phaser.GameObjects.Image;

	private muteMusicButton: MiniButton;
	private muteSoundButton: MiniButton;
	private pauseButton: MiniButton;

	public homeButtons: Phaser.GameObjects.Container;
	public princessButton: RoomButton;
	public heroButton: RoomButton;
	public treasureButton: RoomButton;
	public overworldButton: RoomButton;

	private energyMeter: EnergyMeter;

	private darknessOverlay: Phaser.GameObjects.Image;
	private blockButtons: boolean;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		this.scene = scene;
		this.scene.add.existing(this);

		// this.background = scene.add.image(scene.CX, scene.CY, "background5");
		// scene.fitToScreen(this.background);

		const sep = 230;
		const x1 = -1.5 * sep;
		const x2 = -0.5 * sep;
		const x3 = 0.5 * sep;
		const x4 = 1.5 * sep;
		const y = 0.9 * scene.H;

		this.homeButtons = scene.add.container(scene.CX, y);
		this.add(this.homeButtons);

		/* Volume buttons */
		const buttonSize = 35;
		this.muteMusicButton = new MiniButton(scene, scene.W - 7 * buttonSize, 1.5 * buttonSize, 'music').on('click', () => {
			this.muteMusicButton.toggle();
			this.emit('muteMusic', !this.muteMusicButton.active);
		});
		this.muteSoundButton = new MiniButton(scene, scene.W - 4.2 * buttonSize, 1.5 * buttonSize, 'audio').on('click', () => {
			this.muteSoundButton.toggle();
			this.emit('muteSound', !this.muteSoundButton.active);
		});

		/* Pause button */
		this.pauseButton = new MiniButton(scene, scene.W - 1.5 * buttonSize, 1.5 * buttonSize, 'pause').on('click', () => {
			this.pauseButton.toggle();
			this.scene.scene.pause('GameScene');
			this.scene.scene.launch('PausedScene');
		});

		this.scene.events.on('resume', () => {
			this.pauseButton.toggle();
		});

		/* Castle buttons */

		this.heroButton = new RoomButton(scene, x1, 0, 'button_outside', State.Hero, 'Tower');
		this.heroButton.on('click', () => {
			this.emit('changeRoom', State.Hero);
		});
		this.homeButtons.add(this.heroButton);

		this.princessButton = new RoomButton(scene, x2, 0, 'button_princess', State.Princess, 'Bedroom');
		this.princessButton.on('click', () => {
			this.emit('changeRoom', State.Princess);
		});
		this.homeButtons.add(this.princessButton);

		this.treasureButton = new RoomButton(scene, x3, 0, 'button_sleep', State.Treasure, 'Gold pile');
		this.treasureButton.on('click', () => {
			this.emit('changeRoom', State.Treasure);
		});
		this.homeButtons.add(this.treasureButton);

		this.overworldButton = new RoomButton(scene, x4, 0, 'button_overworld', State.Overworld, 'Overworld');
		this.overworldButton.on('click', () => {
			this.emit('changeRoom', State.Overworld);
		});
		this.homeButtons.add(this.overworldButton);

		/* Energy */

		this.energyMeter = new EnergyMeter(scene, this.treasureButton);
		this.treasureButton.add(this.energyMeter);
		this.treasureButton.moveDown(this.energyMeter);

		/* Darkness */

		this.darknessOverlay = scene.add.image(-this.homeButtons.x, -this.homeButtons.y, 'screen_gradient');
		scene.fitToScreen(this.darknessOverlay);
		this.darknessOverlay.setOrigin(0);
		this.darknessOverlay.setTint(0x330000);
		this.homeButtons.add(this.darknessOverlay);

		this.homeButtons.bringToTop(this.treasureButton);
	}

	update(time: number, delta: number) {
		this.princessButton.update(time, delta);
		this.heroButton.update(time, delta);
		this.treasureButton.update(time, delta);
		this.overworldButton.update(time, delta);

		this.energyMeter.update(time, delta);

		let darkness = Math.max(1 - this.scene.energy / 30, 0);
		this.darknessOverlay.setAlpha(darkness * (1 - 0.1 * Math.abs(Math.sin(time / 200))));

		let buttonAlpha = this.blockButtons ? 0.4 : 1 - 0.25 * darkness;
		this.princessButton.setAlpha(buttonAlpha);
		this.heroButton.setAlpha(buttonAlpha);
		this.overworldButton.setAlpha(buttonAlpha);

		// Don't show the top right buttons on the game over screen
		const hideButtons = this.scene.state == State.GAMEOVER ? 0 : 1;
		this.muteMusicButton.alpha = hideButtons;
		this.muteSoundButton.alpha = hideButtons;
		this.pauseButton.alpha = hideButtons;
	}

	setRoom(state: State) {
		this.homeButtons.setVisible(true);
		// this.homeButtons.setVisible(state == State.Princess || state == State.Hero || state == State.Treasure || state == State.Overworld);
		// this.overworldButtons.setVisible(state == State.Shop || state == State.Town);

		this.princessButton.setRoom(state);
		this.heroButton.setRoom(state);
		this.treasureButton.setRoom(state);
		this.overworldButton.setRoom(state);
	}

	triggerPanicAttack() {
		if (!this.blockButtons) {
			this.blockButtons = true;
			this.princessButton.enabled = false;
			this.heroButton.enabled = false;
			this.overworldButton.enabled = false;
		}
	}

	clearPanicAttack() {
		if (this.blockButtons) {
			this.blockButtons = false;
			this.princessButton.enabled = true;
			this.heroButton.enabled = true;
			this.overworldButton.enabled = true;
		}
	}
}
