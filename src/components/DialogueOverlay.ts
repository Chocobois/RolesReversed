import { GameScene } from '../scenes/GameScene';
import { getDialogue, DialogueKey, Conversation, Message } from './Conversations';
import { DialogueBubble } from './DialogueBubble';
import { Button } from '@/components/Button';

export class DialogueOverlay extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private background: Phaser.GameObjects.Rectangle;
	private leftSprite: Phaser.GameObjects.Image;
	private rightSprite: Phaser.GameObjects.Image;

	private bubbles: DialogueBubble[];
	private bubbleSpawnX: number;
	private bubbleSpawnY: number;
	private bubbleSpacing: number;

	private currentConversation: Conversation;
	private currentMessage: Message;
	private callback: (success: boolean) => void;

	constructor(scene: GameScene) {
		super(scene);
		this.scene = scene;
		this.scene.add.existing(this);

		this.background = scene.add.rectangle(0, 0, scene.W, scene.H, 0, 0.75);
		this.background.setOrigin(0);
		this.background.setInteractive({ useHandCursor: true }).on('pointerdown', this.onClick, this);
		this.add(this.background);

		this.leftSprite = scene.add.image(0, scene.H, 'dialogue_hero');
		this.leftSprite.setOrigin(0, 1);
		this.add(this.leftSprite);

		this.rightSprite = scene.add.image(scene.W, scene.H, 'dialogue_shopkeeper');
		this.rightSprite.setOrigin(1, 1);
		this.add(this.rightSprite);

		this.bubbles = [];
		this.bubbleSpawnX = scene.CX;
		this.bubbleSpawnY = 0.75 * scene.H;
		this.bubbleSpacing = 30;

		this.hide();
	}

	update(time: number, delta: number) {
		const squish = 0.01;
		this.leftSprite.setScale(1.0 + squish * Math.sin(time / 200), 1.0 + squish * Math.sin(-time / 200));
		this.rightSprite.setScale(1.0 - squish * Math.sin(time / 200), 1.0 - squish * Math.sin(-time / 200));

		this.bubbles.forEach((bubble) => {
			bubble.update(time, delta);
		});
	}

	startDialogue(key: DialogueKey, callback: (success: boolean) => void) {
		this.setVisible(true);

		this.callback = callback;
		this.currentConversation = structuredClone(getDialogue(key)); // Deep copy
		console.log(this.currentConversation);

		this.leftSprite.setTexture(this.currentConversation.spriteLeft);
		this.rightSprite.setTexture(this.currentConversation.spriteRight);

		this.nextDialogue();
	}

	nextDialogue() {
		let message = this.currentConversation.messages.shift();

		if (message) {
			this.currentMessage = message;

			// Spawn new speech bubble
			let newBubble = new DialogueBubble(this.scene, this.bubbleSpawnX, this.bubbleSpawnY, message);

			// Move all previous bubbles upwards
			this.bubbles.forEach((bubble) => {
				bubble.smoothY -= newBubble.height + this.bubbleSpacing;
			});
			newBubble.y += newBubble.height / 2;
			newBubble.smoothY -= newBubble.height / 2;

			this.add(newBubble);
			this.bubbles.push(newBubble);
		} else {
			this.callback(true);
			this.hide();
		}
	}

	onClick() {
		this.nextDialogue();
	}

	hide() {
		this.setVisible(false);
		this.bubbles.forEach((bubble) => {
			bubble.destroy();
		});
		this.bubbles = [];
	}
}
