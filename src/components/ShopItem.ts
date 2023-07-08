import { ItemData, ItemType } from '@/rooms/ShopRoom';
import { BaseScene } from '../scenes/BaseScene';
import { Button } from './Button';

export class ShopItem extends Button {
	private background: Phaser.GameObjects.Image;
	private itemContainer: Phaser.GameObjects.Container;
	private itemImage: Phaser.GameObjects.Image;
	// private tagImage: Phaser.GameObjects.Image;

	private size: number;
	private originalY;

	public itemData: ItemData | null;

	constructor(scene: BaseScene, x: number, y: number, size: number) {
		super(scene, x, y);
		this.size = size;
		this.originalY = y;
		this.itemData = null;

		// Background

		// TODO: Change image name
		this.background = this.scene.add.image(10, 0, '');
		this.background.setScale(this.size / this.background.width);
		// this.background.setTint(0xbbbbbb);
		this.background.setAlpha(0.001);
		this.add(this.background);

		// Tag

		// const ty = 120;
		// const fontSize = 50;

		// this.tagImage = this.scene.add.image(0, ty, 'item_tag', 0);
		// this.tagImage.setOrigin(0.5, 0.0);
		// this.tagImage.setScale(120 / this.tagImage.width);
		// this.tagImage.setScale(2.2 * this.tagImage.scaleX, 0.6 * this.tagImage.scaleX); // Fix image, then remove this hack here
		// this.add(this.tagImage);

		// Item

		this.itemContainer = this.scene.add.container();
		this.add(this.itemContainer);

		// TODO: Change image name
		this.itemImage = this.scene.add.image(0, 0, '');
		this.itemContainer.add(this.itemImage);

		// Input

		this.bindInteractive(this.background, true);
		// const inputPadding = 0 / this.background.scaleX;
		// if (this.background.input) this.background.input.hitArea.setTo(-inputPadding, -inputPadding, this.background.width + 2 * inputPadding, this.background.height + 2 * inputPadding);
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
