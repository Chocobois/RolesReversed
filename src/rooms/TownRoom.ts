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
	public exploder: Phaser.GameObjects.Particles.ParticleEmitter[];
	public fadeVariables: number[];
	public stretchScale: number[];
	public defaultStretchScale: number[];
	public buildingList: Button[];
	public stretchRate: number[];

	public buildingHP: number[];
	public defaultBuildingHP: number[];
	public buildingCooldown: number[];
	constructor(scene: GameScene) {
		super(scene);
		this.scene = scene;
		this.scene.add.existing(this);

		this.background = scene.add.image(scene.CX, scene.CY, 'room_town');
		this.add(this.background);
		scene.fitToScreen(this.background);

		this.building1 = new Button(scene, 0.16 * scene.W, 0.7 * scene.H);
		this.building2 = new Button(scene, 0.52 * scene.W, 0.35 * scene.H);
		this.building3 = new Button(scene, 0.78 * scene.W, 0.52 * scene.H);

		this.add(this.building1);
		this.add(this.building2);
		this.add(this.building3);

		this.bldgimg1 = scene.add.image(0, 0, 'BLDG_1');
		this.bldgimg2 = scene.add.image(0, 0, 'BLDG_2');
		this.bldgimg3 = scene.add.image(0, 0, 'BLDG_3');

		this.bldgimg1.setOrigin(0.5, 0.5);
		this.building1.add(this.bldgimg1);
		this.building1.bindInteractive(this.bldgimg1, false);
		this.building1.on(
			'click',
			() => {
				this.onBuildingClick(this.building1, 0);
			},
			this
		);

		this.bldgimg2.setOrigin(0.5, 0.5);
		this.building2.add(this.bldgimg2);
		this.building2.bindInteractive(this.bldgimg2, false);
		this.building2.on(
			'click',
			() => {
				this.onBuildingClick(this.building2, 1);
			},
			this
		);

		this.bldgimg3.setOrigin(0.5, 0.5);
		this.building3.add(this.bldgimg3);
		this.building3.bindInteractive(this.bldgimg3, false);
		this.building3.on(
			'click',
			() => {
				this.onBuildingClick(this.building3, 2);
			},
			this
		);

		this.exploder = [
			this.scene.add.particles(this.building1.x, this.building1.y, 'EXPL', {
				frame: [],
				lifespan: 1000,
				speed: { min: 325, max: 525 },
				scale: { start: 1.75, end: 0 },
				gravityY: 125,
				blendMode: 'NORMAL',
				emitting: false,
			}),
		];

		this.fadeVariables = [1000, 1000, 1000];
		this.defaultStretchScale = [0.02, 0.035, 0.05];
		this.stretchScale = [0.02, 0.035, 0.05];
		this.buildingList = [this.building1, this.building2, this.building3];
		this.stretchRate = [200, 200, 200];
		this.buildingHP = [3, 1, 2];
		this.defaultBuildingHP = [3, 1, 2];
		this.buildingCooldown = [0, 0, 0];
	}

	update(time: number, delta: number) {
		this.squashBuildings(time);
		for (let i = 0; i < this.fadeVariables.length; i++) {
			if (this.fadeVariables[i] > 0 && this.fadeVariables[i] < 1000) {
				this.fadeVariables[i] -= delta;
				if (this.fadeVariables[i] > 0) {
					this.buildingList[i].setAlpha(this.fadeVariables[i] / 1000);
				} else {
					this.buildingList[i].setVisible(false);
					this.fadeVariables[i] = 0;
				}
			}
		}
		for (let i = 0; i < this.buildingCooldown.length; i++) {
			if (this.buildingCooldown[i] > 0) {
				this.buildingCooldown[i] -= delta;
				if (this.buildingCooldown[i] <= 0) {
					this.resetBuilding(i);
				}
			}
		}
	}

	squashBuildings(time: number) {
		const b1HoldX = 1.0 + 0.15 * this.building1.holdSmooth;
		const b1HoldY = 1.0 - 0.1 * this.building1.holdSmooth;
		const b2HoldX = 1.0 + 0.15 * this.building2.holdSmooth;
		const b2HoldY = 1.0 - 0.1 * this.building2.holdSmooth;
		const b3HoldX = 1.0 + 0.15 * this.building3.holdSmooth;
		const b3HoldY = 1.0 - 0.1 * this.building3.holdSmooth;
		const b1Squish = 0.62;
		const b2Squish = 0.035;
		const b3Squish = 0.05;

		this.building1.setScale((1.0 + this.stretchScale[0] * Math.sin(time / 200)) * b1HoldX, (1.0 + this.stretchScale[0] * Math.sin(-time / this.stretchRate[0])) * b1HoldY);
		this.building2.setScale((1.0 + this.stretchScale[1] * Math.sin(time / 200)) * b2HoldX, (1.0 + this.stretchScale[1] * Math.sin(-time / this.stretchRate[1])) * b2HoldY);
		this.building3.setScale((1.0 + this.stretchScale[2] * Math.sin(time / 200)) * b3HoldX, (1.0 + this.stretchScale[2] * Math.sin(-time / this.stretchRate[2])) * b3HoldY);
	}

	resetBuilding(index: number) {
		this.fadeVariables[index] = 1000;
		this.stretchScale[index] = this.defaultStretchScale[index];
		this.buildingHP[index] = this.defaultBuildingHP[index];
		this.stretchRate[index] = 200;
		this.buildingList[index].setAlpha(1);
		this.buildingList[index].setVisible(true);
	}

	onBuildingClick(reference: Button, index: number) {
		if (this.buildingHP[index] > 0) {
			this.exploder[0].x = reference.x;
			this.exploder[0].y = reference.y;
			this.scene.sound.play('EXPL_SOUND');
			this.exploder[0].explode(25);
			this.buildingHP[index]--;
			if (this.buildingHP[index] <= 0) {
				if (this.fadeVariables[index] == 1000) {
					this.fadeVariables[index] = 999;
				}
				this.stretchScale[index] = 0.72;
				this.stretchRate[index] = 10;
				this.scene.addEnergy(this.defaultBuildingHP[index] * 25);
				this.buildingCooldown[index] = this.defaultBuildingHP[index] * 6000;
			}
		}
	}
}
