import { GameScene } from '../scenes/GameScene';
import { Room } from './Room';
import { Button } from '@/components/Button';
import { Notification } from '@/components/RoomButton';
import { ItemType, ItemData, shopItems } from './ShopRoom';
import { DialogueKey } from '@/components/Conversations';

enum PrincessState {
	Idle = 'Idle',
	Begging = 'Begging',
	Sleeping = 'Sleeping',
	Eating = 'Eating',
	Playing = 'Playing',
	Escaping = 'Escaping',
	Fled = 'Fled',
	Dead = 'Dead',
}

export class PrincessRoom extends Room {
	public background: Phaser.GameObjects.Image;
	public escapedForeground: Phaser.GameObjects.Image;
	public princessButton: Button;
	public princessImage: Phaser.GameObjects.Image;

	public speechBubble: Phaser.GameObjects.Container;
	public speechBubbleBackground: Phaser.GameObjects.Image;
	public speechBubbleItem: Phaser.GameObjects.Image;

	private princessState: PrincessState;
	private timer: Phaser.Time.TimerEvent;

	private energy: number;
	private happiness: number;
	private hunger: number;
	private patience: number;
	private wantedItem: ItemData | null; // Item the princess requests
	private heldItem: ItemData | null; // Item the dragon is holding
	private activeItem: ItemData | null; // Item the princess is using

	private firstTimeBeingCaught: boolean;
	private firstTimeWantingItem: boolean;

	constructor(scene: GameScene) {
		super(scene);
		this.scene = scene;
		this.scene.add.existing(this);

		this.background = scene.add.image(scene.CX, scene.CY, 'room_princess');
		this.add(this.background);
		scene.fitToScreen(this.background);

		this.escapedForeground = scene.add.image(scene.CX, scene.CY, 'room_princess_escaped');
		this.add(this.escapedForeground);
		this.escapedForeground.setVisible(false);
		scene.fitToScreen(this.escapedForeground);

		this.princessButton = new Button(scene, scene.CX, scene.CY);
		this.add(this.princessButton);

		this.princessImage = scene.add.image(0, 0, 'princess_default');
		this.princessImage.setOrigin(0.5, 1.0);
		this.princessButton.add(this.princessImage);
		this.princessButton.bindInteractive(this.princessImage, false);
		this.princessButton.on('click', this.onPrincessClick, this);

		// Speech bubble for item requests
		this.speechBubble = scene.add.container(650, 350);
		this.speechBubble.setVisible(false);

		this.speechBubbleBackground = scene.add.image(0, 0, 'speechbubble_small');
		this.speechBubble.add(this.speechBubbleBackground);

		this.speechBubbleItem = scene.add.image(-15, 0, shopItems[0].image);
		this.speechBubbleItem.setScale(0.75);
		this.speechBubble.add(this.speechBubbleItem);

		// Timer
		this.timer = this.scene.time.addEvent({
			delay: 3000,
			callback: this.movementOpportunity,
			callbackScope: this,
			paused: true,
		});

		this.energy = 80;
		this.happiness = 20;
		this.hunger = 100;
		this.patience = 100;
		this.wantedItem = null;
		this.heldItem = null;
		this.activeItem = null;

		this.setPrincessState(PrincessState.Idle);
	}

	update(time: number, delta: number) {
		const princessHoldX = 1.0 + 0.15 * this.princessButton.holdSmooth;
		const princessHoldY = 1.0 - 0.1 * this.princessButton.holdSmooth;
		const princessSquish = this.princessState != PrincessState.Dead ? 0.02 : 0;
		this.princessButton.setScale((1.0 + princessSquish * Math.sin(time / 200)) * princessHoldX, (1.0 + princessSquish * Math.sin(-time / 200)) * princessHoldY);

		this.speechBubbleBackground.setOrigin(0.5, 0.5 + princessSquish * Math.sin(time / 200));
		this.speechBubbleItem.setOrigin(0.5, 0.5 + princessSquish * Math.sin(time / 200));

		/* Moods */

		if (this.visible) {
			switch (this.princessState) {
				case PrincessState.Escaping:
					let frames = ['princess_escape_1', 'princess_escape_2'];
					let index = Math.floor(time / 400) % frames.length;
					this.princessImage.setTexture(frames[index]);
					break;
			}
		}

		if (!this.visible) {
			// Energy
			if (this.princessState == PrincessState.Sleeping) {
				this.addEnergy(3 * (delta / 1000));
			} else {
				this.addEnergy(-2 * (delta / 1000));
			}
			if (this.princessState == PrincessState.Idle && this.energy == 0) {
				this.setPrincessState(PrincessState.Sleeping);
			}
			if (this.princessState == PrincessState.Sleeping && this.energy == 100) {
				this.setPrincessState(PrincessState.Idle);
			}

			// Happiness
			if (this.princessState == PrincessState.Playing) {
				this.addHappiness(3 * (delta / 1000));
			} else {
				if (this.princessState == PrincessState.Sleeping) {
					this.addHappiness(-0.25 * (delta / 1000));
				} else {
					this.addHappiness(-1.0 * (delta / 1000));
				}
			}
			if (this.princessState == PrincessState.Playing && this.happiness == 100) {
				this.activeItem = null;
				this.roomButton.setHeldItem(null);
				this.setPrincessState(PrincessState.Idle);
			}
			if (this.princessState == PrincessState.Idle && this.happiness == 0) {
				this.makePrincessBeg();
			}

			// Hunger
			if (this.princessState == PrincessState.Eating) {
				this.addHunger(4 * (delta / 1000));
			} else {
				if (this.princessState == PrincessState.Sleeping) {
					this.addHunger(-1.0 * (delta / 1000));
				} else {
					this.addHunger(-0.5 * (delta / 1000));
				}
			}
			if (this.princessState == PrincessState.Eating && this.hunger == 100) {
				this.activeItem = null;
				this.roomButton.setHeldItem(null);
				this.setPrincessState(PrincessState.Idle);
			}
			if (this.princessState == PrincessState.Idle && this.hunger == 0) {
				this.makePrincessBeg();
			}

			// Patience
			if (this.princessState == PrincessState.Begging) {
				this.addPatience(-2.0 * (delta / 1000));
				if (this.patience == 0 && this.happiness == 0) {
					this.setPrincessState(PrincessState.Escaping);
				}
				if (this.patience == 0 && this.hunger == 0) {
					this.setPrincessState(PrincessState.Dead);
				}
			} else if (this.princessState == PrincessState.Escaping) {
				this.patience = 50;
			} else {
				this.patience = 100;
			}
		}
	}

	setVisible(isShown: boolean): this {
		if (isShown) {
			if (this.timer) {
				this.timer.paused = true;
			}
		} else {
			if (this.timer.paused) {
				this.timer.paused = false;
			}
		}

		super.setVisible(isShown);
		return this;
	}

	setTimer(delay: number) {
		this.timer.reset({
			delay,
			callback: this.movementOpportunity,
			callbackScope: this,
		});
	}

	// The player is not looking and the princess may perform an action
	movementOpportunity() {
		function chance(odds: number) {
			return Math.random() < odds;
		}

		switch (this.princessState) {
			case PrincessState.Idle:
				console.log(this.scene.difficulty, 0.05 * (1 + this.scene.difficulty));
				if (chance(0.02 * (1 + this.scene.difficulty))) {
					this.setPrincessState(PrincessState.Escaping);
				} else {
					this.setPrincessState(PrincessState.Idle); // Resets timer and image
				}
				break;

			case PrincessState.Sleeping:
				this.setPrincessState(PrincessState.Sleeping); // Resets timer and image
				break;

			case PrincessState.Escaping:
				this.setPrincessState(PrincessState.Fled);
				// this.scene.endGame();
				break;

			case PrincessState.Eating:
			case PrincessState.Playing:
				this.setPrincessState(PrincessState.Idle);
				break;
		}
	}

	setPrincessState(state: PrincessState) {
		this.princessState = state;

		this.speechBubble.setVisible(false);

		switch (this.princessState) {
			case PrincessState.Idle:
				this.princessButton.setPosition(960, 800);
				this.princessImage.setTexture(Phaser.Math.RND.pick(['princess_default', 'princess_stare']));
				this.setTimer(5000);
				break;
			case PrincessState.Begging:
				this.princessButton.setPosition(960, 800);
				this.princessImage.setTexture('princess_plead');
				this.speechBubble.setVisible(true);
				break;
			case PrincessState.Sleeping:
				this.princessImage.setTexture(Phaser.Math.RND.pick(['princess_laying', 'princess_laying_2', 'princess_laying_3']));
				this.princessButton.setPosition(1500, 730);
				this.setTimer(5000);
				break;
			case PrincessState.Eating:
				if (this.activeItem) {
					if (this.activeItem.type == ItemType.Burger) {
						this.princessImage.setTexture('princess_eat_burger');
						this.princessButton.setPosition(780, 870);
					}
					if (this.activeItem.type == ItemType.Cake) {
						this.princessImage.setTexture('princess_eat_cake');
						this.princessButton.setPosition(1450, 760);
					}
				}
				break;
			case PrincessState.Playing:
				if (this.activeItem) {
					if (this.activeItem.type == ItemType.Book) {
						this.princessImage.setTexture('princess_read');
						this.princessButton.setPosition(1450, 800);
					}
					if (this.activeItem.type == ItemType.Toy) {
						this.princessImage.setTexture('princess_play');
						this.princessButton.setPosition(860, 860);
					}
				}
				break;
			case PrincessState.Escaping:
				this.princessImage.setTexture('princess_escape_1');
				this.princessButton.setPosition(1080, 500);
				this.setTimer(5000 + 5000 / (1 + this.scene.difficulty));
				break;
			case PrincessState.Fled:
				this.princessButton.setVisible(false);
				this.princessImage.setVisible(false);
				this.escapedForeground.setVisible(true);
				break;
			case PrincessState.Dead:
				this.princessImage.setTexture('princess_laying');
				this.princessButton.setPosition(930, 800);
				break;
			default:
				break;
		}

		if (this.roomButton) {
			switch (this.princessState) {
				case PrincessState.Begging:
					this.roomButton.setNotification(Notification.Question);
					break;
				case PrincessState.Sleeping:
					this.roomButton.setNotification(Notification.Sleeping);
					break;
				case PrincessState.Escaping:
					this.roomButton.setNotification(Notification.Danger);
					break;
				case PrincessState.Dead:
				case PrincessState.Fled:
					this.roomButton.setNotification(Notification.Dead);
					break;
				default:
					this.roomButton.setNotification(Notification.Calm);
			}
		}
	}

	onPrincessClick() {
		if (this.princessState == PrincessState.Escaping) {
			this.setPrincessState(PrincessState.Idle);
			this.scene.sound.play('CAPTURE_SOUND', { volume: 0.2 });
			this.princessImage.setTexture('princess_plead');
			this.timer.paused = true;

			if (this.wantedItem) {
				this.setPrincessState(PrincessState.Begging);
			}

			if (!this.firstTimeBeingCaught) {
				this.firstTimeBeingCaught = true;
				this.scene.startDialogue(DialogueKey.PrincessCaughtEscaping, (flags) => {
					if (flags.killsHerself) {
						this.setPrincessState(PrincessState.Dead);
					}
				});
			}

			return;
		}

		if (this.princessState == PrincessState.Begging) {
			if (!this.firstTimeWantingItem) {
				this.firstTimeWantingItem = true;
				this.scene.startDialogue(DialogueKey.PrincessWantItem, (flags) => {
					this.scene.uiOverlay.unlockOverworld();
				});
			}

			if (this.heldItem == this.wantedItem) {
				this.activeItem = this.heldItem;
				this.roomButton.setHeldItem(this.activeItem!.image);
				this.wantedItem = null;
				this.heldItem = null;

				if (this.activeItem?.type == ItemType.Burger || this.activeItem?.type == ItemType.Cake) {
					this.setPrincessState(PrincessState.Eating);
				} else {
					this.setPrincessState(PrincessState.Playing);
				}
			}
		}
	}

	makePrincessBeg() {
		this.setPrincessState(PrincessState.Begging);

		let items = Object.values(ItemType);
		if (this.hunger == 0) {
			items = [ItemType.Burger, ItemType.Cake];
		} else if (this.happiness == 0) {
			items = [ItemType.Book, ItemType.Toy];
		}

		let key = Phaser.Math.RND.pick(items);
		this.wantedItem = shopItems.find((item) => item.type == key)!;

		this.speechBubbleItem.setTexture(this.wantedItem.image);
	}

	setHeldItem(itemData: ItemData) {
		this.heldItem = itemData;
		// this.roomButton.setHeldItem(itemData.image);
	}

	addEnergy(increment: number) {
		this.energy = Math.min(Math.max(this.energy + increment, 0), 100);
	}

	addHappiness(increment: number) {
		this.happiness = Math.min(Math.max(this.happiness + increment, 0), 100);
	}

	addHunger(increment: number) {
		this.hunger = Math.min(Math.max(this.hunger + increment, 0), 100);
	}

	addPatience(increment: number) {
		this.patience = Math.min(Math.max(this.patience + increment, 0), 100);
	}

	/* Debug */
	getDebugText() {
		let state = PrincessState[this.princessState];
		let remaining = Math.ceil(this.timer.getRemaining() / 1000) + 's';
		let paused = this.timer.paused ? ' paused' : '';
		return `Princess: ${state} (${remaining}${paused}) Energy: ${this.energy.toFixed()} Happiness: ${this.happiness.toFixed()} Hunger: ${this.hunger.toFixed()} Patience: ${this.patience.toFixed()}`;
	}
}
