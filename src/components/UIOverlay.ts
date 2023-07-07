import { GameScene } from '@/scenes/GameScene';
import { RoomButton } from '@/components/RoomButton';
import State from './State';

export class UIOverlay extends Phaser.GameObjects.Container {
	public scene: GameScene;

	// public background: Phaser.GameObjects.Image;

	private homeButtons: Phaser.GameObjects.Container;
	private princessButton: RoomButton;
	private invaderButton: RoomButton;
	private treasureButton: RoomButton;
	private overworldButton: RoomButton;

	private overworldButtons: Phaser.GameObjects.Container;
	private castleButton: RoomButton;
	private shopButton: RoomButton;
	private townButton: RoomButton;
	private otherButton: RoomButton;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		this.scene = scene;
		this.scene.add.existing(this);

		// this.background = scene.add.image(scene.CX, scene.CY, "background5");
		// scene.fitToScreen(this.background);

		const x1 = -300;
		const x2 = -100;
		const x3 = 100;
		const x4 = 300;

		this.homeButtons = scene.add.container(scene.CX, 0.9 * scene.H);
		this.overworldButtons = scene.add.container(scene.CX, 0.9 * scene.H);

		/* Castle buttons */

		this.invaderButton = new RoomButton(scene, x1, 0, 'button_outside');
		this.invaderButton.on('click', () => {
			this.emit('changeRoom', State.Invader);
		});
		this.homeButtons.add(this.invaderButton);

		this.princessButton = new RoomButton(scene, x2, 0, 'button_princess');
		this.princessButton.on('click', () => {
			this.emit('changeRoom', State.Princess);
		});
		this.homeButtons.add(this.princessButton);

		this.treasureButton = new RoomButton(scene, x3, 0, 'button_sleep');
		this.treasureButton.on('click', () => {
			this.emit('changeRoom', State.Treasure);
		});
		this.homeButtons.add(this.treasureButton);

		this.overworldButton = new RoomButton(scene, x4, 0, 'button_overworld');
		this.overworldButton.on('click', () => {
			this.emit('changeRoom', State.Shop);
		});
		this.homeButtons.add(this.overworldButton);

		/* Overworld buttons */

		this.shopButton = new RoomButton(scene, x1, 0, 'button_outside');
		this.shopButton.on('click', () => {
			this.emit('changeRoom', State.Shop);
		});
		this.overworldButtons.add(this.shopButton);

		this.townButton = new RoomButton(scene, x2, 0, 'button_outside');
		this.townButton.on('click', () => {
			this.emit('changeRoom', State.Town);
		});
		this.overworldButtons.add(this.townButton);

		this.otherButton = new RoomButton(scene, x3, 0, 'button_outside');
		this.otherButton.on('click', () => {
			this.emit('changeRoom', State.Town);
		});
		this.overworldButtons.add(this.otherButton);

		this.castleButton = new RoomButton(scene, x4, 0, 'button_overworld');
		this.castleButton.on('click', () => {
			this.emit('changeRoom', State.Princess);
		});
		this.overworldButtons.add(this.castleButton);
	}

	update(time: number, delta: number) {
		this.princessButton.update(time, delta);
		this.invaderButton.update(time, delta);
		this.treasureButton.update(time, delta);
		this.overworldButton.update(time, delta);
		this.castleButton.update(time, delta);
		this.shopButton.update(time, delta);
		this.townButton.update(time, delta);
		this.otherButton.update(time, delta);
	}

	setRoom(state: State) {
		this.homeButtons.setVisible(
			state == State.Princess ||
				state == State.Invader ||
				state == State.Treasure
		);
		this.overworldButtons.setVisible(
			state == State.Shop || state == State.Town
		);
	}
}
