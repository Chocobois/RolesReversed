import { LEFT } from 'phaser';
import { GameScene } from '../scenes/GameScene';
import { Message, VoiceClips, Conversation } from './Conversations';
import { RoundRectangle } from './RoundRectangle';
import { Button } from '@/components/Button';
import Triangle from 'phaser3-rex-plugins/plugins/triangle.js';

export class DialogueBubble extends Button {
	public scene: GameScene;

	private border: RoundRectangle;
	private background: RoundRectangle;
	private text: Phaser.GameObjects.Text;
	private continueIcon: Phaser.GameObjects.Image;
	// https://english.stackexchange.com/q/379265
	private tailBorder: Triangle;
	private tailFill: Triangle;

	public isLatestMessage: boolean;

	constructor(scene: GameScene, x: number, y: number, width: number, message: Message, conversation: Conversation) {
		super(scene, x, y);
		this.scene = scene;
		this.scene.add.existing(this);

		this.width = width;
		const fontsize = 50;
		const padding = fontsize;
		const radius = 48;
		const border = 20;
		const tailScale = 1.6;
		const borderColor = 0x111111;
		const fillColor = 0xfafaf9;

		const wordSpeechCounter = /[\w']{2,}/g; // https://regexr.com/7gmp0
		const soundsPerWord = 0.4;
		const defaultPitchVariation = 0;
		const defaultDelay = 170; // ms

		this.border = new RoundRectangle(scene, 0, 0, this.width + border, 100 + border, radius, borderColor);
		this.add(this.border);

		if (true) {
			const direction = message.character == LEFT ? -1 : +1;
			const height = fontsize * tailScale;
			const width = (3 / 4) * height;

			this.tailBorder = new Triangle(this.scene, (this.width / 2 + border) * direction, 0, width, height, borderColor);
			this.tailFill = new Triangle(this.scene, (this.width / 2) * direction, 0, width, height, fillColor);
			this.tailBorder.setScale(direction, 1);
			this.tailFill.setScale(direction, 1);
			this.add(this.tailBorder);
			this.add(this.tailFill);
		}

		this.background = new RoundRectangle(scene, 0, 0, this.width, 100, radius - border / 2, fillColor);
		this.add(this.background);

		this.continueIcon = scene.add.image(this.width / 2 - padding / 2, 0, 'down_arrow');
		this.continueIcon.setScale(0.7);
		this.continueIcon.setTint(0x111111);
		this.add(this.continueIcon);

		this.text = scene.createText(-this.width / 2 + padding / 2, 0, fontsize, message.color, message.text);
		this.text.setOrigin(0.0, 0.5);
		this.text.setWordWrapWidth(this.width - padding);
		this.add(this.text);

		this.height = this.text.height + padding + border;
		this.border.setHeight(this.height);
		this.background.setHeight(this.height - border);
		this.continueIcon.y = this.height / 2 - padding / 2;

		this.isLatestMessage = true;

		const currChar = message.character == LEFT ? conversation.leftCharacter : conversation.rightCharacter;

		if (!isNaN(currChar.voice) || !isNaN(message.voice ?? NaN)) {
			const voiceData = VoiceClips[currChar.voice ?? message.voice];
			const speechDelay = voiceData.delay ?? defaultDelay;
			const speechTimes = Math.ceil(0.5 + (message.text.match(wordSpeechCounter)?.length ?? 0) * (voiceData.soundsPerWord ?? soundsPerWord));
			// console.log(speechTimes, message.text);

			for (let i = 0; i < speechTimes; i++) {
				setTimeout(() => {
					const picked = voiceData.preferred ? Phaser.Math.RND.weightedPick(voiceData.preferred) : Math.floor(Math.random() * voiceData.count + 1);
					const pitchVar = voiceData.pitchVar ?? defaultPitchVariation;
					const pitch = 2 * Math.random() * pitchVar - pitchVar + (voiceData.basePitch ?? 1);

					if (this.isLatestMessage && this.active) {
						this.scene.sound.play(voiceData.prefix + picked, { rate: pitch, volume: voiceData.volume });
						// console.log(voiceData.prefix + picked, '@', pitch.toFixed(2), '×');
					}
				}, i * Math.min(speechDelay, 1000));
			}
		}
	}

	update(time: number, delta: number) {
		this.continueIcon.setVisible(this.isLatestMessage);
		this.continueIcon.setOrigin(0.5, 0.7 + 0.1 * Math.sin(time / 100));
	}
}
