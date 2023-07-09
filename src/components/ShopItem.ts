import { ItemData, ItemType } from '@/rooms/ShopRoom';
import { BaseScene } from '../scenes/BaseScene';
import { Button } from './Button';

export class ShopItem extends Button {
	private background: Phaser.GameObjects.Image;
	private itemContainer: Phaser.GameObjects.Container;
	private itemImage: Phaser.GameObjects.Image;

	private size: number;

	public itemData: ItemData | null;

	constructor(scene: BaseScene, x: number, y: number, size: number) {
		super(scene, x, y);
		this.size = size;
		this.itemData = null;

		// Background

		// TODO: Change image name
		this.background = this.scene.add.image(10, 380, 'shop_pole');
		this.background.setScale(this.size / this.background.width);
		this.background.setTint(0xbbbbbb);
		this.add(this.background);

		// Item

		this.itemContainer = this.scene.add.container();
		this.add(this.itemContainer);

		// TODO: Change image name
		this.itemImage = this.scene.add.image(0, 0, '');
		this.itemContainer.add(this.itemImage);

		// Input

		this.bindInteractive(this.itemImage, true);
	}

	update(time: number, delta: number) {
		let wobble = 0.005 * this.scene.H * Math.sin((time + this.x + 2 * this.y) / 300);
		this.itemContainer.y = wobble;

		this.itemContainer.setScale(1.0 - 0.1 * this.holdSmooth);

		this.itemImage.setAlpha(1.0);
	}

	setItem(itemData: ItemData) {
		this.itemData = itemData;

		this.itemImage.setTexture(itemData.image);

		const scale = 0.9;
		const origin = 0.5;
		this.itemImage.setScale((scale * this.size) / this.itemImage.width);
		this.itemImage.setOrigin(0.5, origin);
	}
}
