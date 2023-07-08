import { BaseScene } from './../scenes/BaseScene';
import { RoundRectangle } from './RoundRectangle';

export class Tooltip extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	private radius: number;
	public tooltipText: Phaser.GameObjects.Text;
	public tooltipBackground: RoundRectangle;

	constructor(scene: BaseScene, x: number, y: number, text: string, textSize: number, bgColor: number = 0x3a1919, textColor: string = '#d6a176') {
		super(scene, x, y);
		this.scene = scene;
		scene.add.existing(this);

		this.radius = 25;

		this.tooltipBackground = new RoundRectangle(this.scene, x, y, 200, 50, this.radius, bgColor);
		this.tooltipText = this.scene.createText(x, y, textSize, textColor, text);

		const { width, height } = this.tooltipText.getBounds();
		this.tooltipBackground.setWidth(width + textSize * 0.6);
		this.tooltipBackground.setHeight(height + textSize * 0.2);
		this.tooltipText.setOrigin(0.5, 0.5);
		this.tooltipText.setPosition(this.tooltipBackground.x, this.tooltipBackground.y);
	}

	preDestroy() {
		this.tooltipText.destroy();
		this.tooltipBackground.destroy();
	}
}
