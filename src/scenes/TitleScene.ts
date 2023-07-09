import { BaseScene } from "./BaseScene";
import { Music } from "@/components/Music";

import { version } from "@/version.json";

const creditsLeft = `@Golenchu
@LuxxArt
@KonixKun
@MatoCookies
Lumie
@ArcticFqx
@Dreedawott
Frassy
Soulsong`;

const creditsRight = `code
art
art
music & code
art & code
code
code
script
ideas`;

export class TitleScene extends BaseScene {
	public skybackground: Phaser.GameObjects.Image;
	public background: Phaser.GameObjects.Image;
	public foreground: Phaser.GameObjects.Image;
	public foreground2: Phaser.GameObjects.Image;
	public title: Phaser.GameObjects.Image;

	public credits: Phaser.GameObjects.Container;
	public subtitle: Phaser.GameObjects.Text;
	public tap: Phaser.GameObjects.Text;
	public version: Phaser.GameObjects.Text;

	public musicTitle: Phaser.Sound.WebAudioSound;
	public select: Phaser.Sound.WebAudioSound;
	public select2: Phaser.Sound.WebAudioSound;

	public isStarting: boolean;

	constructor() {
		super({ key: 'TitleScene' });
	}

	create(): void {
		console.log('TitleScene create');
		// this.fade(false, 200, 0x000000);

		this.skybackground = this.add.image(this.CX, this.CY, 'title_skybackground');
		this.fitToScreen(this.skybackground);
		this.background = this.add.image(this.CX, 0.9 * this.H, 'title_background');
		this.background.setOrigin(0.5, 1.0);
		this.fitToScreen(this.background);
		this.foreground = this.add.image(this.CX, this.CY, 'title_foreground');
		this.fitToScreen(this.foreground);
		this.foreground2 = this.add.image(this.CX, this.CY, 'title_foreground_outer');
		this.fitToScreen(this.foreground2);
		this.title = this.add.image(this.CX, 0.86 * this.CY, 'title_title');
		this.fitToScreen(this.foreground2);

		this.background.setVisible(false);
		this.background.setAlpha(0);
		this.background.y += 500;
		this.foreground.x += 3000;
		this.foreground2.y += 6000;

		// this.title = this.createText(0.25*this.W, 0.7*this.H, 160, "#000", "Game Title");
		// this.title.setOrigin(0.5);
		// this.title.setStroke("#FFF", 40*8);
		// this.title.setPadding(2*40*8);
		this.title.setVisible(false);
		this.title.setAlpha(0);

		this.subtitle = this.createText(this.CX, 0.75 * this.H, 120, '#673030', 'Tap to start');
		this.subtitle.setOrigin(0.5);
		this.subtitle.setStroke('#FFF', 20);
		this.subtitle.setPadding(20);
		this.subtitle.setVisible(false);
		this.subtitle.setAlpha(0);

		this.tap = this.createText(this.CX, this.CY, 80, '#000', 'Tap to focus');
		this.tap.setOrigin(0.5);
		this.tap.setAlpha(-1);
		this.tap.setStroke('#FFF', 20);
		this.tap.setPadding(2 * 10);


		this.credits = this.add.container(this.W - 520, this.H);
		this.credits.setVisible(false);
		this.credits.setAlpha(0);

		let credits1 = this.createText(0, 0, 36, '#c2185b', creditsLeft);
		credits1.setOrigin(0, 1);
		credits1.setStroke('#FFF', 16);
		credits1.setPadding(2);
		credits1.setLineSpacing(-18);
		this.credits.add(credits1);

		let credits2 = this.createText(280, 0, 36, '#c2185b', creditsRight);
		credits2.setOrigin(0, 1);
		credits2.setStroke('#FFF', 16);
		credits2.setPadding(2);
		credits2.setLineSpacing(-18);
		this.credits.add(credits2);

		this.version = this.createText(4, this.H, 30, '#000', version);
		this.version.setOrigin(0, 1);
		this.version.setAlpha(0);
		this.version.setStroke('#FFF', 6);
		this.version.setLineSpacing(-18);
		this.version.setPadding(2);
		this.version.setVisible(false);

		// Music
		if (!this.musicTitle) {
			this.musicTitle = new Music(this, 'm_main_menu', { volume: 0.4 });
			this.musicTitle.on('bar', this.onBar, this);
			this.musicTitle.on('beat', this.onBeat, this);

			// this.select = this.sound.add('dayShift', { volume: 0.8, rate: 1.0 }) as Phaser.Sound.WebAudioSound;
			// this.select2 = this.sound.add('nightShift', { volume: 0.8, rate: 1.0 }) as Phaser.Sound.WebAudioSound;
		}
		this.musicTitle.play();

		// Input

		this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', this.progress, this);
		this.input.on(
			'pointerdown',
			(pointer: PointerEvent) => {
				if (pointer.button == 0) {
					this.progress();
				}
			},
			this
		);
		this.isStarting = false;

		console.log('TitleScene create end');
	}

	update(time: number, delta: number) {
		if (this.background.visible) {
			this.background.y += 0.025 * (this.H - this.background.y);
			this.foreground.x += 0.02 * (this.CX - this.foreground.x);
			this.foreground2.y += 0.015 * (this.CY - this.foreground2.y);

			this.background.alpha += 0.03 * (1 - this.background.alpha);

			this.title.alpha += 0.02 * ((this.title.visible ? 1 : 0) - this.title.alpha);
			this.subtitle.alpha += 0.02 * ((this.subtitle.visible ? 1 : 0) - this.subtitle.alpha);
			// this.version.alpha += 0.02 * ((this.version.visible ? 1 : 0) - this.version.alpha);

			if (this.credits.visible) {
				this.credits.alpha += 0.02 * (1 - this.credits.alpha);
			}
			if (this.version.visible) {
				this.version.alpha += 0.02 * (1 - this.version.alpha);
			}
		} else {
			this.tap.alpha += 0.01 * (1 - this.tap.alpha);

			if (this.musicTitle.seek > 0) {
				this.background.setVisible(true);
				this.tap.setVisible(false);
			}
		}

		this.title.setScale(1.0 - 0.005 * Math.sin((5 * time) / 1000));
		this.subtitle.setScale(1.0 + 0.02 * Math.sin((5 * time) / 1000));

		if (this.isStarting) {
			this.subtitle.setAlpha(0.6 + 0.4 * Math.sin((50 * time) / 1000));
		}
	}

	progress() {
		if (!this.background.visible) {
			this.onBar(1);
		} else if (!this.title.visible) {
			this.title.setVisible(true);
			this.title.setAlpha(1);
			this.subtitle.setVisible(true);
			this.subtitle.setAlpha(1);
		} else if (!this.isStarting) {
			this.sound.play('t_rustle', { volume: 0.3 });
			// this.sound.play('m_slice', { volume: 0.3 });
			// this.sound.play('u_attack_button', { volume: 0.5 });
			// this.select2.play();
			this.isStarting = true;
			this.flash(3000, 0xffffff, 0.6);

			this.addEvent(1000, () => {
				this.fade(true, 1000, 0x000000);
				this.addEvent(1050, () => {
					this.musicTitle.stop();
					this.scene.start('GameScene');
				});
			});
		}
	}

	onBar(bar: number) {
		if (bar >= 3) {
			this.title.setVisible(true);
		}
		if (bar >= 4) {
			this.subtitle.setVisible(true);
			this.credits.setVisible(true);
			this.version.setVisible(true);
		}
	}

	onBeat(time: number) {
		this.select.play();
	}
}