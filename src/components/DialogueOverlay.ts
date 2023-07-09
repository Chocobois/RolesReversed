import { ShopRoom } from '@/rooms/ShopRoom';
import { GameScene } from '../scenes/GameScene';
import { ChoiceBubble } from './ChoiceBubble';
import { getDialogue, DialogueKey, Conversation, Message, Choice } from './Conversations';
import { DialogueBubble } from './DialogueBubble';
import { Button } from '@/components/Button';

export class DialogueOverlay extends Phaser.GameObjects.Container {
	public scene: GameScene;
	public shopRoom: ShopRoom;

	private background: Phaser.GameObjects.Rectangle;
	private leftSprite: Phaser.GameObjects.Image;
	private rightSprite: Phaser.GameObjects.Image;

	private bubbleContainer: Phaser.GameObjects.Container;
	private bubbles: (DialogueBubble | ChoiceBubble)[];
	private bubbleY: number;
	private bubbleSpawnY: number;
	private bubbleSpacing: number;

	private currentConversation: Conversation;
	private currentMessage: Message;
	private hasActiveChoice: boolean;
	private callback: (flags: { [key: string]: any }) => void;
	private flags: { [key: string]: any };

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

		this.bubbleY = 0;
		this.bubbleSpawnY = 0.75 * this.scene.H;
		this.bubbleContainer = scene.add.container(scene.CX, this.bubbleY);
		this.add(this.bubbleContainer);
		this.bubbleContainer.width = 800;
		this.bubbles = [];
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

		this.bubbleContainer.y += (this.bubbleY - this.bubbleContainer.y) / 10;
	}

	startDialogue(key: DialogueKey, callback: (flags: { [key: string]: any }) => void) {
		this.setVisible(true);

		this.callback = callback;
		this.flags = {};
		this.currentConversation = structuredClone(getDialogue(key)); // Deep copy

		this.leftSprite.setTexture(this.currentConversation.spriteLeft);
		this.rightSprite.setTexture(this.currentConversation.spriteRight);

		if (this.scene?.shopRoom?.active) this.scene.shopRoom.hideShopkeeper = true;

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
			if (this.scene?.shopRoom?.hideShopkeeper == true) this.scene.shopRoom.hideShopkeeper = false;
			this.callback(this.flags);
			this.hide();
		}
	}

	addSpeechBubble(message: Message) {
		// Spawn new speech bubble
		let newBubble = new DialogueBubble(this.scene, 0, this.bubbleSpawnY - this.bubbleY, this.bubbleContainer.width, message);

		if (message.flags) {
			Object.assign(this.flags, message.flags);
		}

		this.bubbleY -= newBubble.height + this.bubbleSpacing;

		// Move all previous bubbles upwards
		this.bubbles.forEach((bubble) => {
			bubble.isLatestMessage = false;
		});
		newBubble.y += newBubble.height / 2;

		this.bubbleContainer.add(newBubble);
		this.bubbles.push(newBubble);
	}

	addChoiceBubbles(choices: Choice[]) {
		let gap = 50;
		let width = (this.bubbleContainer.width - 20 - gap * (choices.length - 1)) / choices.length;

		let newChoiceBubbles = choices.map((choice) => {
			// Spawn new choice bubble
			let newBubble = new ChoiceBubble(this.scene, 0, this.bubbleSpawnY - this.bubbleY, width, choice);
			this.bubbleContainer.add(newBubble);

			newBubble.on('click', () => {
				if (newBubble.enabled && this.hasActiveChoice) {
					this.currentConversation.messages = structuredClone(choice.messages); // Deep copy
					this.disableAllChoices(newBubble);
					this.nextDialogue();
				}
			});

			return newBubble;
		});

		this.bubbleY -= newChoiceBubbles[0].height + this.bubbleSpacing;

		// Move all previous bubbles upwards
		this.bubbles.forEach((bubble) => {
			bubble.isLatestMessage = false;
		});

		newChoiceBubbles.forEach((bubble, index) => {
			if (index == 0) bubble.x -= width / 2 + gap / 2;
			if (index == 1) bubble.x += width / 2 + gap / 2;

			bubble.y += bubble.height / 2;
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
