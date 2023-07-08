import { GameScene } from '../scenes/GameScene';
import { RoomButton } from '@/components/RoomButton';

export class Room extends Phaser.GameObjects.Container {
	public scene: GameScene;

	public roomButton: RoomButton;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		this.scene = scene;
		this.scene.add.existing(this);
	}

	setRoomButton(roomButton: RoomButton) {
		this.roomButton = roomButton;
	}

	getDebugText(): string {
		return '';
	}
}
