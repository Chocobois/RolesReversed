import { Button } from '@/components/Button';
import { GameScene } from '../scenes/GameScene';
import { Room } from './Room';
import { ParticleManager } from '@/components/Particle';
import { DialogueKey } from '@/components/Conversations';

export class TreasureRoom extends Room {
	private background: Phaser.GameObjects.Image;
	private dragonButton: Button;
	private dragonImage: Phaser.GameObjects.Image;
	private breathTime: number;
	public particlesMato: ParticleManager;
	public particlesPhaser: Phaser.GameObjects.Particles.ParticleEmitter;
	private spawnTimer: Phaser.Time.TimerEvent;

	private firstTimePanicAttack: boolean;

	constructor(scene: GameScene) {
		super(scene);
		this.scene = scene;
		this.scene.add.existing(this);

		this.background = scene.add.image(scene.CX, scene.CY, 'room_sleep');
		this.add(this.background);
		scene.fitToScreen(this.background);

		// God this was so poorly documented
		const zone = new Phaser.GameObjects.Particles.Zones.RandomZone({
			getRandomPoint(point) {
				const shape = new Phaser.Geom.Triangle(1300, 240, 550, 940, 2160, 1024);
				const newPoint = shape.getRandomPoint();
				point.x = newPoint.x;
				point.y = newPoint.y;
			},
		});

		this.particlesPhaser = this.scene.add.particles(0, 0, 'particle_sparkle', {
			lifespan: 350,
			speed: 0,
			scale: { start: 0.9, end: 0.1 },
			alpha: { start: 1, end: 0 },
			blendMode: 'ADD',
			frequency: 200,
			emitting: true,
			emitZone: zone,
		});
		this.add(this.particlesPhaser);

		this.dragonButton = new Button(scene, 1230, 830);
		this.add(this.dragonButton);

		this.dragonImage = scene.add.image(0, 0, 'dragon_sleep');
		this.dragonImage.setScale(0.9);
		this.dragonImage.setOrigin(0.5, 0.9);
		this.dragonButton.add(this.dragonImage);

		this.dragonButton.bindInteractive(this.dragonImage);
		this.dragonButton.on('click', () => {
			this.scene.addEnergy(1);
		});

		this.breathTime = 0;

		this.particlesMato = new ParticleManager(this.scene);

		if (!this.spawnTimer) {
			this.spawnTimer = this.scene.time.addEvent({
				delay: 1000,
				loop: true,
				callback: () => this.visible && !this.scene.uiOverlay.blockButtons && this.particlesMato.push([1220, 580, 'particle_sleep', Phaser.Math.RND.between(0, 3)], 3.5, this.particlesMato.DEAFULT_EFFECTS),
			});
		}
	}

	update(time: number, delta: number) {
		if (this.visible) {
			this.particlesMato.update(time, delta);

			let holdX = 1.0 + 0.03 * this.dragonButton.holdSmooth;
			let holdY = 1.0 - 0.06 * this.dragonButton.holdSmooth;
			let squish = 0.015;
			let speed = 400;
			let vibrate = 0;
			let vibrateSpeed = 0;

			if (this.scene.energy < 30) {
				this.dragonImage.setTexture('dragon_sleep_low');
				speed = 150;
				vibrate = 0.0005;
				vibrateSpeed = 8;
			} else if (this.scene.energy < 70) {
				this.dragonImage.setTexture('dragon_sleep');
				speed = 200;
			} else {
				this.dragonImage.setTexture('dragon_sleep_high');
			}

			this.breathTime += delta / speed;
			this.dragonButton.setScale((1.0 + squish * Math.sin(this.breathTime)) * holdX, (1.0 + squish * Math.sin(-this.breathTime)) * holdY);
			this.dragonImage.setOrigin(0.5 + vibrate * Math.sin(vibrateSpeed * this.breathTime), 0.9);
		} else {
			this.particlesMato.die();
		}
	}

	setVisible(isShown: boolean): this {
		if (isShown) {
			if (!this.firstTimePanicAttack && this.scene.energy == 0) {
				this.firstTimePanicAttack = true;
				this.scene.startDialogue(DialogueKey.GoldPanicAttack);
			}
		}

		return super.setVisible(isShown);
	}

	/* Debug */
	getDebugText() {
		return `Energy: ${this.scene.energy.toFixed(0)} / ${this.scene.maxEnergy}`;
	}
}
