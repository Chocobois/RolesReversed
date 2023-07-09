import { GameScene } from '../scenes/GameScene';
import { Room } from './Room';
import { Button } from '@/components/Button';

export class Building extends Button {
	public scene: GameScene;
	public image: Phaser.GameObjects.Image;
	public rubble: Phaser.GameObjects.Image;

	public exploder: Phaser.GameObjects.Particles.ParticleEmitter;

	public buildingHP: number;
	public defaultBuildingHP: number;
	public buildingCooldown: number;

	constructor(scene: GameScene, x: number, y: number, key: string, rubble: Phaser.GameObjects.Image) {
		super(scene, x, y);
		this.scene = scene;

		this.image = scene.add.image(0, 0, key);
		this.image.setOrigin(0.5, 0.8);
		this.add(this.image);
		this.bindInteractive(this.image, false);
		this.on('click', this.onClick, this);

		this.exploder = this.scene.add.particles(0, 0, 'EXPL', {
			frame: [],
			lifespan: 1000,
			angle: { min: 180, max: 360 },
			speed: { min: 325, max: 525 },
			scale: { start: 1.5, end: 0 },
			gravityY: 500,
			blendMode: 'NORMAL',
			emitting: false,
		});
		this.add(this.exploder);

		this.buildingHP = 5;
		this.defaultBuildingHP = 5;
		this.buildingCooldown = 0;

		this.rubble = rubble;
	}

	reset() {
		this.buildingHP = this.defaultBuildingHP;
		this.setAlpha(1);
		this.image.setVisible(true);

		this.rubble.setVisible(false);
	}

	update(time: number, delta: number) {
		const b1HoldX = 1.0 + 0.04 * this.holdSmooth;
		const b1HoldY = 1.0 - 0.08 * this.holdSmooth;
		const stretch = 0.01;
		this.setScale((1.0 + stretch * Math.sin(time / 200)) * b1HoldX, (1.0 + stretch * Math.sin(-time / 200)) * b1HoldY);
	}

	cooldown(time: number, delta: number) {
		if (this.buildingCooldown > 0) {
			this.buildingCooldown -= delta;
			if (this.buildingCooldown <= 0) {
				this.reset();
			}
		}
	}

	onClick() {
		if (this.buildingHP > 0) {
			this.scene.sound.play('EXPL_SOUND', { volume: 0.2 });
			this.exploder.explode(3);
			this.scene.addEnergy(3);

			this.buildingHP--;
			if (this.buildingHP <= 0) {
				this.image.setVisible(false);
				this.rubble.setVisible(true);
				this.buildingCooldown = this.defaultBuildingHP * 6000;
				this.scene.addEnergy(10);

				this.scene.sound.play('DEMO_SOUND', { volume: 0.05 });
				this.exploder.explode(15);
			}
		}
	}
}

export class TownRoom extends Room {
	public background: Phaser.GameObjects.Image;
	public rubble1: Phaser.GameObjects.Image;
	public rubble2: Phaser.GameObjects.Image;
	public rubble3: Phaser.GameObjects.Image;
	public foreground: Phaser.GameObjects.Image;

	public buildings: Building[];

	constructor(scene: GameScene) {
		super(scene);
		this.scene = scene;
		this.scene.add.existing(this);

		this.background = scene.add.image(scene.CX, scene.CY, 'town_bg');
		this.add(this.background);
		scene.fitToScreen(this.background);

		this.rubble1 = scene.add.image(scene.CX, scene.CY, 'town_rubble_1');
		this.rubble1.setVisible(false);
		this.add(this.rubble1);
		scene.fitToScreen(this.rubble1);

		this.rubble2 = scene.add.image(scene.CX, scene.CY, 'town_rubble_2');
		this.rubble2.setVisible(false);
		this.add(this.rubble2);
		scene.fitToScreen(this.rubble2);

		this.rubble3 = scene.add.image(scene.CX, scene.CY, 'town_rubble_3');
		this.rubble3.setVisible(false);
		this.add(this.rubble3);
		scene.fitToScreen(this.rubble3);

		let building1 = new Building(scene, 370, 710, 'town_build_1', this.rubble1);
		let building2 = new Building(scene, 1205, 640, 'town_build_2', this.rubble2);
		let building3 = new Building(scene, 1680, 695, 'town_build_3', this.rubble3);
		this.buildings = [];
		this.buildings.push(building1);
		this.buildings.push(building2);
		this.buildings.push(building3);
		this.add(building1);
		this.add(building2);
		this.add(building3);

		this.foreground = scene.add.image(scene.CX, scene.CY, 'town_fg');
		this.add(this.foreground);
		scene.fitToScreen(this.foreground);
	}

	update(time: number, delta: number) {
		this.buildings.forEach((building) => {
			building.update(time, delta);
			if (!this.visible) {
				building.cooldown(time, delta);
			}
		});
	}
}
