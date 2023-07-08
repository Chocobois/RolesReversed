import { GameScene } from '../scenes/GameScene';
import { Button } from './Button';
import State from './State';

export enum Notification {
	Calm = 1,
	Danger = 2,
}

export class RoomButton extends Button {
	private image: Phaser.GameObjects.Image;
	private border: Phaser.GameObjects.Image;
	private notification: Phaser.GameObjects.Image;
	// private text: Phaser.GameObjects.Text;

	private room: State;
	private size: number;
	private notificationState: Notification;

	constructor(scene: GameScene, x: number, y: number, key: string, room: State) {
		super(scene, x, y);
		this.room = room;
		this.size = 0.17 * this.scene.H;

		this.image = this.scene.add.image(0, 0, key);
		this.image.setScale(this.size / this.image.width);
		this.add(this.image);

		this.border = this.scene.add.image(0, 0, 'button_ring_off');
		this.border.setScale(this.size / this.border.width);
		this.add(this.border);

		this.notification = this.scene.add.image(70, -70, 'button_notification');
		this.notification.setScale(this.size / this.notification.width);
		this.add(this.notification);

		this.bindInteractive(this.image, false);
		// const inputPadding = 40 / this.image.scaleX;
		// this.image.input.hitArea.setTo(-inputPadding, -inputPadding, this.image.width+2*inputPadding, this.image.height+2*inputPadding);

		this.setNotification(Notification.Calm);
	}

	update(time: number, delta: number) {
		const holdX = 1.0 + 0.15 * this.holdSmooth;
		const holdY = 1.0 - 0.1 * this.holdSmooth;
		const buttonSquish = -0.01;
		this.setScale((1.0 + buttonSquish * Math.sin(time / 200)) * holdX, (1.0 + buttonSquish * Math.sin(-time / 200)) * holdY);

		if (this.notificationState == Notification.Danger) {
			const squish = 0.3;
			this.notification.setScale(1.0 - squish + squish * Math.abs(Math.sin(time / 200)), 1.0 - squish + squish * Math.abs(Math.sin(-time / 200)));
		}
	}

	setRoom(room: State) {
		this.border.setTexture(room == this.room ? 'button_ring_on' : 'button_ring_off');
	}

	setNotification(value: Notification) {
		this.notificationState = value;

		switch (value) {
			case Notification.Calm:
				this.notification.setVisible(false);
				break;
			case Notification.Danger:
				this.notification.setVisible(true);
				break;
			default:
				break;
		}
	}
}
