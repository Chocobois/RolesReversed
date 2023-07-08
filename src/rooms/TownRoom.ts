import { GameScene } from "../scenes/GameScene";
import { Room } from './Room';
import { Button } from '@/components/Button';

export class TownRoom extends Room {
	public background: Phaser.GameObjects.Image;
	public building1: Button;
	public building2: Button;
	public building3: Button;
	public bldgimg1: Phaser.GameObjects.Image;
	public bldgimg2: Phaser.GameObjects.Image;
	public bldgimg3: Phaser.GameObjects.Image;

	constructor(scene: GameScene) {
		super(scene);
		this.scene = scene;
		this.scene.add.existing(this);

		this.background = scene.add.image(scene.CX, scene.CY, 'room_town');
		this.add(this.background);
		scene.fitToScreen(this.background);

		this.building1 = new Button(scene, 0.16 * scene.W, 0.95 * scene.H);
		this.building2 = new Button(scene, 0.52 * scene.W, 0.6 * scene.H);
		this.building3 = new Button(scene, 0.78 * scene.W, 0.74 * scene.H);

		this.add(this.building1);
		this.add(this.building2);
		this.add(this.building3);

		this.bldgimg1 = scene.add.image(0, 0, 'BLDG_1');
		this.bldgimg2 = scene.add.image(0, 0, 'BLDG_2');
		this.bldgimg3 = scene.add.image(0, 0, 'BLDG_3');

		this.bldgimg1.setOrigin(0.5, 1.0);
		this.building1.add(this.bldgimg1);
		this.building1.bindInteractive(this.bldgimg1, false);
		this.building1.on('click', this.onBuildingClick, this);

		this.bldgimg2.setOrigin(0.5, 1.0);
		this.building2.add(this.bldgimg2);
		this.building2.bindInteractive(this.bldgimg2, false);
		this.building2.on('click', this.onBuildingClick, this);

		this.bldgimg3.setOrigin(0.5, 1.0);
		this.building3.add(this.bldgimg3);
		this.building3.bindInteractive(this.bldgimg3, false);
		this.building3.on('click', this.onBuildingClick, this);
	}

	update(time: number, delta: number) {
		this.squashBuildings(time);
	}

	squashBuildings(time: number) {
		const b1HoldX = 1.0 + 0.15 * this.building1.holdSmooth;
		const b1HoldY = 1.0 - 0.1 * this.building1.holdSmooth;
		const b2HoldX = 1.0 + 0.15 * this.building2.holdSmooth;
		const b2HoldY = 1.0 - 0.1 * this.building2.holdSmooth;
		const b3HoldX = 1.0 + 0.15 * this.building3.holdSmooth;
		const b3HoldY = 1.0 - 0.1 * this.building3.holdSmooth;
		const b1Squish = 0.02;
		const b2Squish = 0.035;
		const b3Squish = 0.05;

		this.building1.setScale((1.0 + b1Squish * Math.sin(time / 200)) * b1HoldX, (1.0 + b1Squish * Math.sin(-time / 200)) * b1HoldY);
		this.building2.setScale((1.0 + b2Squish * Math.sin(time / 200)) * b2HoldX, (1.0 + b2Squish * Math.sin(-time / 200)) * b2HoldY);
		this.building3.setScale((1.0 + b3Squish * Math.sin(time / 200)) * b3HoldX, (1.0 + b3Squish * Math.sin(-time / 200)) * b3HoldY);
	}

	onBuildingClick() {}
}
