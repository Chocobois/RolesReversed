import { GameScene } from '../scenes/GameScene';
import { Room } from './Room';
import { Button } from '@/components/Button';
import { ShopItem } from '@/components/ShopItem';

export enum ItemType {
	Plush,
	Book,
	Blanket,
	Cake,
	SoldOut,
	ShopOwner,
	NOTYPE,
}

export interface ItemData {
	type: ItemType;
	image: string;
	title: string;
	description: string;
	iteration: number;
	maxIteration: number;
	price: number;
	value: number;
	sideEffect: (() => void) | null;
}

const SOLD_OUT_ITEM: ItemData = {
	type: ItemType.SoldOut,
	image: 'shop_sold_out',
	title: 'Out of stock',
	description: "I give up. That's it.",
	iteration: 1,
	maxIteration: 1,
	value: 9999,
	price: 0,
	sideEffect: null,
};

const OWNER: ItemData = {
	type: ItemType.ShopOwner,
	image: 'shop_sold_out',
	title: 'Shop owner',
	description: "H-hey, I'm not for sale!",
	iteration: 1,
	maxIteration: 1,
	value: 9999,
	price: 0,
	sideEffect: null,
};

export class ShopRoom extends Room {
	public background: Phaser.GameObjects.Image;
	private ownerButton: Button;
	private ownerImage: Phaser.GameObjects.Image;
	private foreground: Phaser.GameObjects.Image;
	private buyImage: Phaser.GameObjects.Image;
	private buyButton: Button;

	private selectedItemTitle: Phaser.GameObjects.Text;
	private selectedItemDescription: Phaser.GameObjects.Text;

	private items: ShopItem[];
	private selectedItem: ItemData | null;

	private itemsForSale: ItemData[];

	constructor(scene: GameScene) {
		super(scene);
		this.scene = scene;
		this.scene.add.existing(this);

		this.background = scene.add.image(scene.CX, scene.CY, 'room_shop');
		this.add(this.background);
		scene.fitToScreen(this.background);

		this.itemsForSale = [
			{
				type: ItemType.Cake,
				image: 'cake',
				title: 'Cake',
				description: 'Increase your root energy a little.',
				price: 150,
				iteration: 1,
				maxIteration: 6,
				value: 150,
				sideEffect: () => {},
			},
			{
				type: ItemType.Book,
				image: 'sapling',
				title: 'Magic Storage',
				description: 'Increase your root energy a little.',
				price: 150,
				iteration: 1,
				maxIteration: 6,
				value: 150,
				sideEffect: () => {},
			},
			{
				type: ItemType.Plush,
				image: 'sapling',
				title: 'Magic Storage',
				description: 'Increase your root energy a little.',
				price: 150,
				iteration: 1,
				maxIteration: 6,
				value: 150,
				sideEffect: () => {},
			},
			SOLD_OUT_ITEM,
			SOLD_OUT_ITEM,
			SOLD_OUT_ITEM,
		];

		const W = this.scene.W;
		const H = this.scene.H;

		// Background
		this.background = this.scene.add.image(0, 0, 'shop_background');
		this.background.setOrigin(0);
		this.scene.fitToScreen(this.background);
		this.add(this.background);
		this.background.setInteractive().on(
			'pointerdown',
			() => {
				this.selectItem(null);
			},
			this
		);

		const jx = 0.61 * W;
		const jy = 0.67 * H;
		const jh = 0.88 * H;
		this.ownerButton = new Button(this.scene, jx, jy);
		this.add(this.ownerButton);

		// TODO: Change image name
		this.ownerImage = this.scene.add.image(0, 0, 'jbun');
		this.ownerImage.setOrigin(0.5, 0.8);
		this.ownerImage.setScale(jh / this.ownerImage.height);
		this.ownerButton.add(this.ownerImage);

		this.ownerButton.bindInteractive(this.ownerImage);
		this.ownerImage.input?.hitArea.setTo(0, 0, this.ownerImage.width, (this.ownerImage.height * 2) / 3);
		this.ownerButton.on('down', () => {
			this.scene.sound.play('s_squish1', {
				rate: 1 + 0.07 * Math.sin(this.scene.time.now / 800),
			});
		});
		this.ownerButton.on('click', () => {
			this.selectItem(OWNER);
			this.ownerImage.setFrame(2);
			this.scene.sound.play('s_squish2', {
				rate: 1 + 0.07 * Math.sin(this.scene.time.now / 800),
			});
		});

		// Foreground
		this.foreground = this.scene.add.image(0, 0, 'shop_foreground');
		this.foreground.setOrigin(0);
		this.scene.fitToScreen(this.foreground);
		this.add(this.foreground);

		// Selected item
		const sx = 0.43 * W;
		const sy = 0.81 * H;

		this.selectedItemTitle = this.scene.createText(sx, sy, 62 * this.scene.SCALE, '#000', 'Something');
		this.selectedItemTitle.setOrigin(0, 1.08);
		this.add(this.selectedItemTitle);

		this.selectedItemDescription = this.scene.createText(sx, sy, 52 * this.scene.SCALE, '#000', 'Culpa ut quis ullamco nisi aliqua id est occaecat proident aliqua in.');
		this.selectedItemDescription.setWordWrapWidth(3.6 * W);
		this.selectedItemDescription.setLineSpacing(0);
		this.selectedItemDescription.setOrigin(0, -0.08);
		this.add(this.selectedItemDescription);

		// Buy button
		this.buyButton = new Button(this.scene, 0.89 * W, 0.81 * H);
		this.add(this.buyButton);

		this.buyImage = this.scene.add.image(0, 0, 'shop_buy_button');
		this.buyImage.setOrigin(0.5);
		this.buyImage.setScale((0.17 * H) / this.buyImage.height);
		this.buyButton.add(this.buyImage);

		let buyText = this.scene.createText(0, 0, 100 * this.scene.SCALE, '#000', 'Buy');
		buyText.setOrigin(0.5);
		this.buyButton.add(buyText);

		this.buyButton.bindInteractive(this.buyImage);
		this.buyButton.on('click', this.buyItem, this);

		// Items
		this.items = [];
		this.selectedItem = null;

		const itemLeft = 160 * this.scene.SCALE;
		const itemTop = 195 * this.scene.SCALE;
		const itemWidth = 320 * this.scene.SCALE;
		const itemHeight = 306 * this.scene.SCALE;
		const itemSize = 280 * this.scene.SCALE;

		for (let j = 0; j < 3; j++) {
			for (let i = 0; i < 2; i++) {
				const x = itemLeft + i * itemWidth;
				const y = itemTop + j * itemHeight;

				let item = new ShopItem(this.scene, x, y, itemSize);
				item.on(
					'click',
					() => {
						this.selectItem(item.itemData);
						this.scene.sound.play('s_click');
					},
					this
				);
				this.add(item);
				this.items.push(item);
			}
		}
	}
	update(time: number, delta: number) {}

	selectItem(itemData: ItemData | null, justPurchased: boolean = false) {
		this.selectedItem = itemData;

		this.buyButton.enabled = false;
		this.buyButton.setAlpha(0.5);
		if (this.buyImage.input) this.buyImage.input.cursor = 'not-allowed';
		this.ownerImage.setFrame(0);

		if (itemData) {
			const cost = itemData.price;

			this.selectedItemTitle.setText(itemData.title[itemData.iteration - 1]);
			this.selectedItemDescription.setText(itemData.description[itemData.iteration - 1]);

			if (cost > 0) {
				this.ownerImage.setFrame(1);

				if (this.scene.money >= cost) {
					this.buyButton.enabled = true;
					this.buyButton.setAlpha(1.0);
					if (this.buyImage.input) this.buyImage.input.cursor = 'pointer';
				}
			}
		} else {
			if (justPurchased) {
				this.selectedItemTitle.setText('Whatever');
				this.selectedItemDescription.setText('Thanks for buying it!');
			} else {
				this.selectedItemTitle.setText('None selected');
				this.selectedItemDescription.setText("What are ya buying? What are ya selling? I don't know!");
			}
		}
	}

	buyItem() {
		if (!this.buyButton.enabled) {
			return;
		}

		if (this.selectedItem) {
			const cost = this.selectedItem.price;

			if (this.scene.money >= cost) {
				this.scene.money -= cost;
				this.scene.sound.play('s_buy');

				this.emit('buy', this.selectedItem);
				const sideEffect = this.selectedItem.sideEffect;
				if (sideEffect) {
					sideEffect();
				}
			}
		}
	}
}
