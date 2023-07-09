import { ShopRoom } from '@/rooms/ShopRoom';
import { GameScene } from '../scenes/GameScene';
import { ChoiceBubble } from './ChoiceBubble';
import { getDialogue, DialogueKey, Conversation, Message, Choice } from './Conversations';
import { DialogueBubble } from './DialogueBubble';
import { Button } from '@/components/Button';
import { LEFT } from 'phaser';

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
	private currentMessage: Message | null;
	private hasActiveChoice: boolean;
	private callback?: (flags: { [key: string]: any }) => void;
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

	startDialogue(key: DialogueKey, callback?: (flags: { [key: string]: any }) => void) {
		this.setVisible(true);

		this.callback = callback;
		this.flags = {};
		this.currentConversation = structuredClone(getDialogue(key)); // Deep copy

		this.leftSprite.setTexture(this.currentConversation.leftCharacter.sprite);
		this.rightSprite.setTexture(this.currentConversation.rightCharacter.sprite);

		if (this.scene?.shopRoom?.active) this.scene.shopRoom.hideShopkeeper = true;

		this.nextDialogue();
	}

	nextDialogue() {
		if (this.currentMessage && this.currentMessage.choice) {
			this.hasActiveChoice = true;
			this.addChoiceBubbles(this.currentMessage.choice);
		} else {
			let message = this.currentConversation.messages.shift();

			if (message) {
				this.currentMessage = message;
				this.addSpeechBubble(message);
			} else {
				if (this.scene?.shopRoom?.hideShopkeeper == true) this.scene.shopRoom.hideShopkeeper = false;
				if (this.callback) {
					this.callback(this.flags);
				}
				this.hide();
			}
		}
	}

	addSpeechBubble(message: Message) {
		if (message.leftSprite) {
			this.leftSprite.setTexture(message.leftSprite);
		}
		if (message.rightSprite) {
			this.rightSprite.setTexture(message.rightSprite);
		}
		if (!message.color) {
			if (message.character == LEFT) {
				message.color = this.currentConversation.leftCharacter.color;
			} else {
				message.color = this.currentConversation.rightCharacter.color;
			}
		}

		// Spawn new speech bubble
		let newBubble = new DialogueBubble(this.scene, 0, this.bubbleSpawnY - this.bubbleY, this.bubbleContainer.width, message, this.currentConversation);

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
		let halfWidth = (this.bubbleContainer.width - 20 - gap) / 2;
		let fullWidth = this.bubbleContainer.width;

		let newChoiceBubbles = choices.map((choice) => {
			// Spawn new choice bubble
			let newBubble = new ChoiceBubble(this.scene, 0, this.bubbleSpawnY - this.bubbleY, choices.length == 1 ? fullWidth : halfWidth, choice);
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

		let offset = newChoiceBubbles[0].height + this.bubbleSpacing;
		this.bubbleY -= offset * Math.ceil(choices.length / 2);

		// Move all previous bubbles upwards
		this.bubbles.forEach((bubble) => {
			bubble.isLatestMessage = false;
		});

		newChoiceBubbles.forEach((bubble, index) => {
			if (choices.length == 2) {
				if (index == 0) bubble.x -= halfWidth / 2 + gap / 2;
				if (index == 1) bubble.x += halfWidth / 2 + gap / 2;
			} else if (choices.length == 3) {
				if (index == 0) bubble.x -= halfWidth / 2 + gap / 2;
				if (index == 1) bubble.x += halfWidth / 2 + gap / 2;
				if (index == 2) bubble.y += offset;
			} else if (choices.length == 4) {
				if (index % 2 == 0) bubble.x -= halfWidth / 2 + gap / 2;
				if (index % 2 == 1) bubble.x += halfWidth / 2 + gap / 2;
				if (index > 1) bubble.y += offset;
			}

			bubble.y += bubble.height / 2;
			this.bubbles.push(bubble);
		});
	}

	disableAllChoices(chosen: ChoiceBubble) {
		this.hasActiveChoice = false;
		this.currentMessage = null;

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
