import { GameScene } from '../scenes/GameScene';

export interface ParticleEffects {
	move?: {
		moveSpeed?: number;
		direction?: number;
	};
	wave?: {
		enable: boolean;
		waveSpeed?: number;
		waveAngle?: number;
		waveAmplitude?: number;
	};
	fadeOut?: {
		enable: boolean;
		baseOpacity?: number;
	};
	animate?: {
		enable: boolean;
		frameCount: number;
		frameDuration?: number;
	};
}

export interface ParticleData {
	sprite: Phaser.GameObjects.Sprite;
	elapsedTime: number;
	elapsedFrames: number;
	lifespan: number;
	origin: Phaser.Math.Vector2;
	effects: ParticleEffects;
}

type CreateSpriteOptions = [x: number, y: number, texture: string | Phaser.Textures.Texture, frame?: string | number];

const ONE_OVER_TWO_PI = 1 / Phaser.Math.PI2;

export class ParticleManager extends Phaser.GameObjects.Container {
	public scene: GameScene;
	public particles: Array<ParticleData>;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		this.scene = scene;
		scene.add.existing(this);

		this.particles = [];
		this.DEFAULT_MOVE_SPEED = 80;
		this.DEFAULT_WAVE_SPEED = 5;
		this.DEFAULT_WAVE_AMPLITUDE = 50;

		this.DEAFULT_EFFECTS = {
			fadeOut: { enable: true },
			move: { moveSpeed: this.DEFAULT_MOVE_SPEED },
			wave: { waveAmplitude: this.DEFAULT_WAVE_AMPLITUDE, enable: true },
			animate: { enable: true, frameCount: 4, frameDuration: 650 },
		};

		this.DEAFULT_EFFECTS_HALF = {
			fadeOut: { enable: true },
			move: { moveSpeed: this.DEFAULT_MOVE_SPEED / 2 },
			wave: { waveAmplitude: this.DEFAULT_WAVE_AMPLITUDE / 2, enable: true },
		};
	}

	public DEFAULT_MOVE_SPEED: number;
	public DEFAULT_WAVE_SPEED: number;
	public DEFAULT_WAVE_AMPLITUDE: number;
	public readonly DEFAULT_MOVE_ANGLE: number = Phaser.Math.DegToRad(-45);
	public readonly DEFAULT_WAVE_ANGLE: number = Phaser.Math.DegToRad(180);

	public DEAFULT_EFFECTS: ParticleEffects;
	public DEAFULT_EFFECTS_HALF: ParticleEffects;

	update(time: number, delta: number) {
		const extraTime = delta / 1000;
		let removeFlag = false;

		this.particles.forEach((data) => {
			data.elapsedTime += extraTime;

			if (data.elapsedTime > data.lifespan) {
				removeFlag = true;
				data.sprite.destroy();
				data.elapsedTime = -1;
			} else {
				const effects = {
					move: (data.effects.move?.moveSpeed ?? 0) != 0,
					wave: data.effects.wave?.enable,
					fade: data.effects.fadeOut?.enable,
					animate: data.effects.animate?.enable,
				};

				const { x, y } = data.origin;
				let newPosition = new Phaser.Math.Vector2(x, y);
				let log: string[] = [];

				if (effects.move) {
					const moveOffset = new Phaser.Math.Vector2(0, 0).setToPolar(data.effects.move?.direction ?? this.DEFAULT_MOVE_ANGLE, data.elapsedTime * (data.effects.move?.moveSpeed ?? this.DEFAULT_MOVE_SPEED));
					// log = [...log, "moveOffset", moveOffset.x.toFixed(2), moveOffset.y.toFixed(2)];
					newPosition.add(moveOffset);
				}

				if (effects.wave) {
					const multiplier = ONE_OVER_TWO_PI * (data.effects.wave?.waveAmplitude ?? this.DEFAULT_WAVE_AMPLITUDE);

					const phase = data.elapsedTime * (data.effects.wave?.waveSpeed ?? this.DEFAULT_WAVE_SPEED);
					const amplitude = multiplier;

					const waveOffset = new Phaser.Math.Vector2(amplitude * Math.sin(phase), 0);
					waveOffset.rotate(data.effects.wave?.waveAngle ?? this.DEFAULT_WAVE_ANGLE);

					// log = [...log, "waveOffset", waveOffset.x.toFixed(2), waveOffset.y.toFixed(2)];
					newPosition.add(waveOffset);
				}

				if (effects.wave || effects.move) {
					data.sprite.setPosition(newPosition.x, newPosition.y);
				}

				if (effects.fade) {
					const progress = data.elapsedTime / data.lifespan;
					data.sprite.alpha = (data.effects.fadeOut?.baseOpacity ?? 1) * (1 - progress);
				}

				if (effects.animate) {
					if (1000 * data.elapsedTime > data.elapsedFrames * (data.effects.animate?.frameDuration ?? 650)) {
						data.elapsedFrames++;
						const newFrame = Math.floor(Math.random() * (data.effects.animate?.frameCount ?? 1));
						// console.log('Setting frame from', data.sprite.frame, 'to', newFrame);
						data.sprite.setTexture(data.sprite.texture.key, newFrame);
					}
				}

				// console.log(...log)
			}
		});

		// Remove destroyed sprite from array

		if (removeFlag) this.particles = this.particles.filter((data) => data.elapsedTime != -1);
	}

	/**
	 * Register a new sprite as a particle
	 * @param sprite Phaser Sprite object to use, or arguments for creating one
	 * @param lifespan Lifespan in seconds
	 * @param effects Object describing effects (move, fade, wave, animate)
	 */
	push(
		sprite: Phaser.GameObjects.Sprite | CreateSpriteOptions,
		lifespan: number = 1,
		effects: ParticleEffects = {
			wave: { enable: false },
			fadeOut: { enable: false },
		}
	) {
		const spriteObject = sprite instanceof Phaser.GameObjects.Sprite ? sprite : this.scene.add.sprite(...sprite);

		const origin = { x: spriteObject.x, y: spriteObject.y };
		Object.freeze(origin);

		const effectDefaults = {
			move: { moveSpeed: this.DEFAULT_MOVE_SPEED, direction: this.DEFAULT_MOVE_ANGLE },
			fadeOut: { enable: false, baseOpacity: 'alpha' in sprite ? sprite.alpha : 1 },
			wave: {
				enable: false,
				waveSpeed: this.DEFAULT_WAVE_SPEED,
				waveAngle: this.DEFAULT_WAVE_ANGLE,
				waveAmplitude: this.DEFAULT_WAVE_AMPLITUDE,
			},
		};
		this.particles.push({
			sprite: spriteObject,
			elapsedTime: 0,
			elapsedFrames: 0,
			lifespan,
			effects: { ...effectDefaults, ...effects },
			origin: new Phaser.Math.Vector2(origin),
		});
	}

	getArray() {
		return this.particles;
	}

	die() {
		let removeCounter = 0;
		this.particles.forEach((particle) => {
			particle.sprite.destroy();
			removeCounter++;
		});
		this.particles = [];
		return removeCounter;
	}
}
