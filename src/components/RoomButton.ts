import { GameScene } from '../scenes/GameScene';
import { Button } from './Button';
import { Tooltip, TooltipStyle } from './Tooltip';
import State from './State';

export enum Notification {
	Calm,
	Sleeping,
	Question,
	Danger,
	Dead,
}

export class RoomButton extends Button {
	private image: Phaser.GameObjects.Image;
	private border: Phaser.GameObjects.Image;
	private notification: Phaser.GameObjects.Image;
	private heldItem: Phaser.GameObjects.Image; // Used on the princess room button
	private tooltip: Tooltip;
	// private text: Phaser.GameObjects.Text;

	private room: State;
	public size: number;
	private notificationState: Notification;
	private label: string | undefined;
	private gScene: GameScene;

	constructor(scene: GameScene, x: number, y: number, key: string, room: State, label?: string) {
		super(scene, x, y);
		this.gScene = scene;
		this.room = room;
		this.size = 0.17 * this.scene.H;

		this.image = this.scene.add.image(0, 0, key);
		this.image.setScale(this.size / this.image.width);
		this.add(this.image);

		this.border = this.scene.add.image(0, 0, 'button_ring_off');
		this.border.setScale(this.size / this.border.width);
		this.add(this.border);

		this.heldItem = this.scene.add.image(-70, -70, 'item_burger');
		this.heldItem.setScale(0.4);
		this.add(this.heldItem);

		this.notification = this.scene.add.image(70, -70, 'button_notification_danger');
		this.add(this.notification);

		this.label = label;

		this.bindInteractive(this.image, false);
		// const inputPadding = 40 / this.image.scaleX;
		// this.image.input.hitArea.setTo(-inputPadding, -inputPadding, this.image.width+2*inputPadding, this.image.height+2*inputPadding);

		this.setNotification(Notification.Calm);
		this.setHeldItem(null);
	}

	update(time: number, delta: number) {
		const holdX = this.enabled ? 1.0 + 0.15 * this.holdSmooth : 1;
		const holdY = this.enabled ? 1.0 - 0.1 * this.holdSmooth : 1;
		const buttonSquish = -0.01;
		this.setScale((1.0 + buttonSquish * Math.sin(time / 200)) * holdX, (1.0 + buttonSquish * Math.sin(-time / 200)) * holdY);
		this.image.setTint(this.enabled ? 0xffffff : 0x777777);

		this.notification.setOrigin(0.5);

		if (this.notificationState == Notification.Sleeping) {
			const squish = 0.05;
			this.notification.setOrigin(0.5, 0.5 + squish * Math.sin(time / 200));
		}
		if (this.notificationState == Notification.Question) {
			const squish = 0.3;
			this.notification.setScale(0.7 + squish * Math.abs(Math.sin(time / 200)), 1.0 - squish + squish * Math.abs(Math.sin(time / 200)));
		}
		if (this.notificationState == Notification.Danger) {
			const squish = 0.3;
			this.notification.setScale(0.7 + squish * Math.abs(Math.sin(time / 200)), 1.0 - squish + squish * Math.abs(Math.sin(time / 200)));
		}
	}

	setRoom(room: State) {
		this.border.setTexture(room == this.room ? 'button_ring_on' : 'button_ring_off');
	}

	setNotification(value: Notification) {
		if (this.notificationState == value) {
			return;
		}

		this.notificationState = value;
		this.notification.setVisible(true);

		switch (value) {
			case Notification.Calm:
				this.notification.setVisible(false);
				break;

			case Notification.Sleeping:
				this.notification.setTexture('button_notification_sleeping');
				this.notification.setScale(0.7);
				break;

			case Notification.Question:
				this.notification.setTexture('button_notification_question');
				this.notification.setScale(0.85);
				break;

			case Notification.Danger:
				this.notification.setTexture('button_notification_danger');
				this.notification.setScale(0.7);
				break;

			case Notification.Dead:
				this.notification.setTexture('button_notification_dead');
				this.notification.setScale(0.85);
				break;
		}
	}

	setHeldItem(key: string | null) {
		if (key) {
			this.heldItem.setVisible(true);
			this.heldItem.setTexture(key);
		} else {
			this.heldItem.setVisible(false);
		}
	}

	onOut(pointer: Phaser.Input.Pointer, event: Phaser.Types.Input.EventData) {
		if (this.tooltip && this.tooltip.active) {
			this.tooltip.fade(150, 1, 0, () => {
				this.tooltip.destroy();
			});
		}

		super.onOut(pointer, event);
	}

	onOver(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData) {
		if (this.enabled) {
			if (this.label) this.spawnTooltip();
		}
		super.onOver(pointer, localX, localY, event);
	}

	onUp(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData) {
		if (this.enabled) {
			if (this.label) this.spawnTooltip(TooltipStyle.Light);
		}
		super.onUp(pointer, localX, localY, event);
	}

	spawnTooltip(styleOverride?: TooltipStyle) {
		const replacing = this.tooltip?.active;
		if (replacing) this.tooltip.destroy();
		const style = styleOverride ? styleOverride : this.gScene.state == this.room ? TooltipStyle.Light : TooltipStyle.Dark;
		const { x: dx, y: dy } = this.parentContainer ?? { x: 0, y: 0 };
		this.tooltip = new Tooltip(this.scene, dx + this.x, dy + this.y + 76, `${this.label}`, 36, style);
		if (!replacing) this.tooltip.fade(70);
	}
}
