import { BaseScene } from './BaseScene';
import State from '@/components/State';
import { Music } from '@/components/Music';

import { PrincessRoom } from '@/rooms/PrincessRoom';
import { HeroRoom } from '@/rooms/HeroRoom';
import { TreasureRoom } from '@/rooms/TreasureRoom';
import { ItemData, ShopRoom } from '@/rooms/ShopRoom';
import { TownRoom } from '@/rooms/TownRoom';
import { OverworldRoom } from '@/rooms/OverworldRoom';
import { GameOverRoom } from '@/rooms/GameOverRoom';

import { UIOverlay } from '@/components/UIOverlay';
import { DialogueOverlay } from '@/components/DialogueOverlay';
import { DialogueKey } from '@/components/Conversations';

export class GameScene extends BaseScene {
	public background: Phaser.GameObjects.Image;

	public state: State;
	public maxEnergy: number;
	public energy: number;

	private princessRoom: PrincessRoom;
	private heroRoom: HeroRoom;
	private treasureRoom: TreasureRoom;
	public shopRoom: ShopRoom;
	private townRoom: TownRoom;
	private overworldRoom: OverworldRoom;
	private gameOverRoom: GameOverRoom;

	private uiOverlay: UIOverlay;
	private dialogueOverlay: DialogueOverlay;
	private debugText: Phaser.GameObjects.Text;

	// Music
	public musicPrincess: Music;
	public musicInvader: Music;
	public musicTreasure: Music;
	public musicShop: Music;
	public musicTown: Music;
	public musicOverworld: Music;
	public musicVolume: number;

	//placeholder for now
	public difficulty: number;

	constructor() {
		super({ key: 'GameScene' });
	}

	create(): void {
		this.fade(false, 200, 0x000000);

		/* Rooms */

		this.princessRoom = new PrincessRoom(this);
		this.heroRoom = new HeroRoom(this);
		this.treasureRoom = new TreasureRoom(this);
		this.shopRoom = new ShopRoom(this);
		this.townRoom = new TownRoom(this);
		this.overworldRoom = new OverworldRoom(this);
		this.gameOverRoom = new GameOverRoom(this);
		this.overworldRoom.on('changeRoom', this.setRoom, this);

		/* UI */

		this.uiOverlay = new UIOverlay(this);
		this.uiOverlay.on('changeRoom', this.setRoom, this);

		this.dialogueOverlay = new DialogueOverlay(this);
		this.dialogueOverlay.on('finishDialogue', () => {}, this);

		this.debugText = this.createText(0, 0, 30, 'white');
		this.debugText.setStroke('black', 10);
		this.debugText.setLineSpacing(-10);

		this.princessRoom.setRoomButton(this.uiOverlay.princessButton);
		this.heroRoom.setRoomButton(this.uiOverlay.heroButton);
		this.treasureRoom.setRoomButton(this.uiOverlay.treasureButton);
		this.shopRoom.setRoomButton(this.uiOverlay.shopButton);
		this.townRoom.setRoomButton(this.uiOverlay.townButton);
		this.overworldRoom.setRoomButton(this.uiOverlay.overworldButton);

		/* Music */

		this.musicPrincess = new Music(this, 'm_princess', { volume: 0 });
		this.musicInvader = new Music(this, 'm_invader', { volume: 0 });
		this.musicTreasure = new Music(this, 'm_treasure', { volume: 0 });
		this.musicShop = new Music(this, 'm_shop', { volume: 0 });
		this.musicTown = new Music(this, 'm_town', { volume: 0 });
		this.musicOverworld = new Music(this, 'm_overworld', { volume: 0 });

		this.uiOverlay.on('muteMusic', this.setMusicMuted, this);
		this.uiOverlay.on('muteSound', this.setSoundMuted, this);

		this.musicPrincess.play();
		this.musicInvader.play();
		this.musicTreasure.play();
		this.musicShop.play();
		this.musicTown.play();
		this.musicOverworld.play();

		/* Setup */

		this.maxEnergy = 100;
		this.energy = 50;
		this.difficulty = 0;
		this.setRoom(State.Princess);
	}

	update(time: number, delta: number) {
		if (this.state == State.Treasure) {
			this.addEnergy(4 * (delta / 1000));
		} else {
			this.addEnergy(-1 * (delta / 1000));
		}

		this.princessRoom.update(time, delta);
		this.heroRoom.update(time, delta);
		this.treasureRoom.update(time, delta);
		this.shopRoom.update(time, delta);
		this.townRoom.update(time, delta);
		this.overworldRoom.update(time, delta);
		//dont update gameOverRoom right now

		this.uiOverlay.update(time, delta);

		this.dialogueOverlay.update(time, delta);

		let debugText = '';
		debugText += this.princessRoom.getDebugText() + '\n';
		debugText += this.heroRoom.getDebugText() + '\n';
		debugText += this.treasureRoom.getDebugText() + '\n';
		this.debugText.setText(debugText);
	}

	setRoom(state: State) {
		this.state = state;
		this.uiOverlay.setRoom(state);

		this.princessRoom.setVisible(state == State.Princess);
		this.heroRoom.setVisible(state == State.Hero);
		this.treasureRoom.setVisible(state == State.Treasure);
		this.shopRoom.setVisible(state == State.Shop);
		this.townRoom.setVisible(state == State.Town);
		this.overworldRoom.setVisible(state == State.Overworld);
		this.gameOverRoom.setVisible(state == State.GAMEOVER);
	}

	startDialogue(key: DialogueKey, callback: (success: boolean) => void) {
		this.dialogueOverlay.startDialogue(key, callback);
	}

	addEnergy(increment: number) {
		this.energy = Math.min(Math.max(this.energy + increment, 0), 100);
	}

	setHeldItem(itemData: ItemData) {
		this.princessRoom.setHeldItem(itemData);
	}

	endGame() {
		if (this.state != State.GAMEOVER) {
			this.sound.play('GAME_OVER_SOUND');
		}
		this.setRoom(State.GAMEOVER);
		this.uiOverlay.setVisible(false);
	}

	setMusicMuted(muted: boolean) {
		this.musicPrincess.mute = muted;
		this.musicInvader.mute = muted;
		this.musicTreasure.mute = muted;
		this.musicShop.mute = muted;
		this.musicTown.mute = muted;
		this.musicOverworld.mute = muted;
	}

	setSoundMuted(muted: boolean) {
		this.sound.mute = muted;
	}
}
