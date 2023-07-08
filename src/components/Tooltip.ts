import { BaseScene } from './../scenes/BaseScene';
import { RoundRectangle } from './RoundRectangle';

export enum TooltipStyle {
	Custom = -1,
	Dark = 0,
	Light = 1,
}

const styles = [
	{ bg: 0x3a1919, text: '#d6a176' }, // Dark
	{ bg: 0xffffff, text: '#682E2E' }, // Light
];

export class Tooltip extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	private radius: number;
	public tooltipText: Phaser.GameObjects.Text;
	public tooltipBackground: RoundRectangle;

	constructor(scene: BaseScene, x: number, y: number, text: string, textSize: number, style: TooltipStyle = TooltipStyle.Custom, bgColor: number = 0x3a1919, textColor: string = '#d6a176') {
		super(scene, x, y);
		this.scene = scene;
		scene.add.existing(this);

		this.radius = 25;

		const customStyle = style == TooltipStyle.Custom;

		this.tooltipBackground = new RoundRectangle(this.scene, x, y, 200, 50, this.radius, customStyle ? bgColor : styles[style].bg);
		this.tooltipText = this.scene.createText(x, y, textSize, customStyle ? textColor : styles[style].text, text);

		const { width, height } = this.tooltipText.getBounds();
		this.tooltipBackground.setWidth(width + textSize * 1.2);
		this.tooltipBackground.setHeight(height + textSize * 0.2);
		this.tooltipText.setOrigin(0.5, 0.5);
		this.tooltipText.setPosition(this.tooltipBackground.x, this.tooltipBackground.y);
	}

	preDestroy() {
		this.tooltipText.destroy();
		this.tooltipBackground.destroy();
	}

	fade(duration: number, from: number = 0, to: number = 1, onComplete?: Phaser.Types.Tweens.TweenOnCompleteCallback) {
		this.scene.tweens.add({
			targets: [this.tooltipBackground, this.tooltipText],
			alpha: { from, to },
			duration,
			onComplete,
		});
	}
}
