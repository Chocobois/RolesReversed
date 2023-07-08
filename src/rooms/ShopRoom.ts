import { FacebookInstantGamesLeaderboard } from 'phaser';
import { GameScene } from '../scenes/GameScene';
import { Room } from './Room';
import { Button } from '@/components/Button';
import { ShopItem } from '@/components/ShopItem';
import { DialogueKey } from '@/components/Conversations';

export enum ItemType {
	Book,
	Toy,
	Burger,
	Cake,
}

export interface ItemData {
	type: ItemType;
	image: string;
	name: string;
}

export class ShopRoom extends Room {
	public background: Phaser.GameObjects.Image;
	private ownerButton: Button;
	private deskBgImage: Phaser.GameObjects.Image;
	private deskImage: Phaser.GameObjects.Image;
	private ownerImage: Phaser.GameObjects.Image;
	private ownerTailImage: Phaser.GameObjects.Image;
	private dragonSprite: Phaser.GameObjects.Image;
	private buyImage: Phaser.GameObjects.Image;

	private items: ShopItem[];

	private itemsForSale: ItemData[];

	constructor(scene: GameScene) {
		super(scene);
		this.scene = scene;
		this.scene.add.existing(this);

		this.background = scene.add.image(scene.CX, scene.CY, 'room_shop');
		this.add(this.background);
		scene.fitToScreen(this.background);
		this.background.setInteractive().on(
			'pointerdown',
			() => {
				this.selectItem(null);
			},
			this
		);

		this.itemsForSale = [
			{
				type: ItemType.Burger,
				image: 'item_burger',
				name: 'Burger',
			},
			{
				type: ItemType.Book,
				image: 'item_book',
				name: 'Book',
			},
			{
				type: ItemType.Toy,
				image: 'item_toy',
				name: 'Toy',
			},
			{
				type: ItemType.Cake,
				image: 'item_cake',
				name: 'Cake',
			},
		];

		const W = this.scene.W;
		const H = this.scene.H;

		const jx = 1555;
		const jy = 840;
		const jh = 0.88 * H;

		// Desk bg
		this.deskBgImage = this.scene.add.image(scene.CX + 575, scene.CY, 'shop_bg');
		this.add(this.deskBgImage);

		// Owner tail
		this.ownerTailImage = this.scene.add.image(jx, jy, 'shop_tail');
		this.ownerTailImage.setOrigin(0.5, 0.8);
		this.ownerTailImage.setScale(jh / this.ownerTailImage.height);
		this.add(this.ownerTailImage);

		// Desk front
		this.deskImage = this.scene.add.image(scene.CX + 575, scene.CY, 'shop_desk');
		this.add(this.deskImage);

		// Owner
		this.ownerButton = new Button(this.scene, jx, jy);
		this.add(this.ownerButton);

		this.ownerImage = this.scene.add.image(0, 0, 'shop_kobold');
		this.ownerImage.setOrigin(0.5, 0.8);
		this.ownerImage.setScale(jh / this.ownerImage.height);
		this.ownerButton.add(this.ownerImage);

		this.ownerButton.bindInteractive(this.ownerImage);
		this.ownerImage.input?.hitArea.setTo(0, 0, this.ownerImage.width, (this.ownerImage.height * 2) / 3);
		this.ownerButton.on('down', () => {
			// this.scene.sound.play('s_squish1', {
			// 	rate: 1 + 0.07 * Math.sin(this.scene.time.now / 800),
			// });
		});

		// Dragon
		// this.dragonSprite = this.scene.add.image(0, 0, 'dragon_shop');
		// this.dragonSprite.setOrigin(0);
		// this.add(this.dragonSprite);

		// Items
		this.items = [];

		const itemLeft = 340;
		const itemTop = 320;
		const itemWidth = 360;
		const itemHeight = 320;
		const itemSize = 400;

		for (let j = 0; j < 2; j++) {
			for (let i = 0; i < 2; i++) {
				const x = itemLeft + i * itemWidth + (j * itemWidth) / 2;
				const y = itemTop + j * itemHeight;

				let item = new ShopItem(this.scene, x, y, itemSize);
				item.setItem(this.itemsForSale[j * 2 + i]);
				item.on(
					'click',
					() => {
						this.selectItem(item.itemData);
						// this.scene.sound.play('s_click');
					},
					this
				);
				this.add(item);
				this.items.push(item);
			}
		}
	}
	update(time: number, delta: number) {
		const jbunHoldX = 1.0 + 0.15 * this.ownerButton.holdSmooth;
		const jbunHoldY = 1.0 - 0.075 * this.ownerButton.holdSmooth;
		const jbunSquish = 0.02;
		this.ownerButton.setScale((1.0 + jbunSquish * Math.sin(time / 200)) * jbunHoldX, (1.0 + jbunSquish * Math.sin(-time / 200)) * jbunHoldY);
		this.ownerTailImage.setScale(1.0 - jbunSquish * Math.sin(time / 200), 1.0 - jbunSquish * Math.sin(-time / 200));

		this.items.forEach((item) => item.update(time, delta));
	}

	selectItem(itemData: ItemData | null) {
		console.log('BUY', itemData);
		if (itemData) {
			this.scene.startDialogue(DialogueKey.ShopPurchase);
		}
	}

	buyItem() {
		// if (!this.buyButton.enabled) {
		// 	return;
		// }
		// if (this.selectedItem) {
		// 	const cost = this.selectedItem.price;
		// 	if (this.scene.energy >= cost) {
		// 		this.scene.energy -= cost;
		// 		// this.scene.sound.play('s_buy');
		// 		this.emit('buy', this.selectedItem);
		// 		const sideEffect = this.selectedItem.sideEffect;
		// 		if (sideEffect) {
		// 			sideEffect();
		// 		}
		// 	}
		// }
	}
}
