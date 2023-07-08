import { GameScene } from '../scenes/GameScene';
import { ChoiceBubble } from './ChoiceBubble';
import { getDialogue, DialogueKey, Conversation, Message, Choice } from './Conversations';
import { DialogueBubble } from './DialogueBubble';
import { Button } from '@/components/Button';

export class DialogueOverlay extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private background: Phaser.GameObjects.Rectangle;
	private leftSprite: Phaser.GameObjects.Image;
	private rightSprite: Phaser.GameObjects.Image;

	private bubbleWidth: number;
	private bubbles: (DialogueBubble | ChoiceBubble)[];
	private bubbleSpawnX: number;
	private bubbleSpawnY: number;
	private bubbleSpacing: number;

	private currentConversation: Conversation;
	private currentMessage: Message;
	private hasActiveChoice: boolean;
	private callback: (success: boolean) => void;

	constructor(scene: GameScene) {
		super(scene);
		this.scene = scene;
		this.scene.add.existing(this);

		this.background = scene.add.rectangle(0, 0, scene.W, scene.H, 0, 0.75);
		this.background.setOrigin(0);
		this.background.setInteractive({ useHandCursor: true }).on('pointerdown', this.onBackgroundClick, this);
		this.add(this.background);

		this.leftSprite = scene.add.image(0, scene.H, 'dialogue_hero');
		this.leftSprite.setOrigin(0, 1);
		this.add(this.leftSprite);

		this.rightSprite = scene.add.image(scene.W, scene.H, 'dialogue_shopkeeper');
		this.rightSprite.setOrigin(1, 1);
		this.add(this.rightSprite);

		this.bubbleWidth = 900;
		this.bubbles = [];
		this.bubbleSpawnX = scene.CX;
		this.bubbleSpawnY = 0.75 * scene.H;
		this.bubbleSpacing = 30;

		this.hasActiveChoice = false;

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

		this.leftSprite.setTexture(this.currentConversation.spriteLeft);
		this.rightSprite.setTexture(this.currentConversation.spriteRight);

		this.nextDialogue();
	}

	nextDialogue() {
		let message = this.currentConversation.messages.shift();

		if (message) {
			this.currentMessage = message;
			this.addSpeechBubble(message);

			if (message.choice) {
				this.hasActiveChoice = true;
				this.addChoiceBubbles(message.choice);
			}
		} else {
			this.callback(true);
			this.hide();
		}
	}

	addSpeechBubble(message: Message) {
		// Spawn new speech bubble
		let newBubble = new DialogueBubble(this.scene, this.bubbleSpawnX, this.bubbleSpawnY, this.bubbleWidth, message);

		// Move all previous bubbles upwards
		this.bubbles.forEach((bubble) => {
			bubble.smoothY -= newBubble.height + this.bubbleSpacing;
			bubble.isLatestMessage = false;
		});
		newBubble.y += newBubble.height / 2;
		newBubble.smoothY -= newBubble.height / 2;

		this.add(newBubble);
		this.bubbles.push(newBubble);
	}

	addChoiceBubbles(choices: Choice[]) {
		let gap = 50;
		let width = (this.bubbleWidth - 20 - gap * (choices.length - 1)) / choices.length;

		let newChoiceBubbles = choices.map((choice) => {
			// Spawn new choice bubble
			let newBubble = new ChoiceBubble(this.scene, this.bubbleSpawnX, this.bubbleSpawnY, width, choice);
			this.add(newBubble);

			newBubble.on('click', () => {
				if (newBubble.enabled && this.hasActiveChoice) {
					this.currentConversation.messages = structuredClone(choice.messages); // Deep copy
					this.disableAllChoices(newBubble);
					this.nextDialogue();
				}
			});

			return newBubble;
		});

		// Move all previous bubbles upwards
		this.bubbles.forEach((bubble) => {
			bubble.smoothY -= newChoiceBubbles[0].height + this.bubbleSpacing;
			bubble.isLatestMessage = false;
		});

		newChoiceBubbles.forEach((bubble, index) => {
			if (index == 0) bubble.x -= width / 2 + gap / 2;
			if (index == 1) bubble.x += width / 2 + gap / 2;

			bubble.y += bubble.height / 2;
			bubble.smoothY -= bubble.height / 2;
			this.bubbles.push(bubble);
		});
	}

	disableAllChoices(chosen: ChoiceBubble) {
		this.hasActiveChoice = false;
		this.bubbles.forEach((bubble) => {
			if (bubble instanceof ChoiceBubble) {
				bubble.enabled = false;
				bubble.setAlpha(0.5);
			}
		});

		chosen.setAlpha(1);
		chosen.highlight();
	}

	onBackgroundClick() {
		if (!this.hasActiveChoice) {
			this.nextDialogue();
		}
	}

	hide() {
		this.setVisible(false);
		this.bubbles.forEach((bubble) => {
			bubble.destroy();
		});
		this.bubbles = [];
	}
}
