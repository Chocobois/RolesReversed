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
	public musicBacking: Music;
	public musicGoldPile: Music;
	public musicHighEnergy: Music;
	public musicDrumLoop: Music;
	public musicDanger: Music;
	public musicStrings: Music;
	public musicPiano: Music;
	public musicGuitar: Music;

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
		this.debugText.setVisible(false);

		this.princessRoom.setRoomButton(this.uiOverlay.princessButton);
		this.heroRoom.setRoomButton(this.uiOverlay.heroButton);
		this.treasureRoom.setRoomButton(this.uiOverlay.treasureButton);
		this.overworldRoom.setRoomButton(this.uiOverlay.overworldButton);

		/* Music */

		const baseVolume = 0.3;
		this.musicBacking = new Music(this, 'm_backing', { volume: baseVolume });
		this.musicGoldPile = new Music(this, 'm_goldpile', { volume: baseVolume });
		this.musicHighEnergy = new Music(this, 'm_highenergy', { volume: baseVolume });
		this.musicDrumLoop = new Music(this, 'm_drumloop', { volume: baseVolume });
		this.musicDanger = new Music(this, 'm_danger', { volume: baseVolume });
		this.musicStrings = new Music(this, 'm_strings', { volume: baseVolume });
		this.musicPiano = new Music(this, 'm_piano', { volume: baseVolume });
		this.musicGuitar = new Music(this, 'm_guitar', { volume: baseVolume });

		this.uiOverlay.on('muteMusic', this.setMusicMuted, this);
		this.uiOverlay.on('muteSound', this.setSoundMuted, this);

		this.musicBacking.play();
		this.musicGoldPile.play();
		this.musicHighEnergy.play();
		this.musicDrumLoop.play();
		this.musicDanger.play();
		this.musicStrings.play();
		this.musicPiano.play();
		this.musicGuitar.play();

		/* Setup */

		this.maxEnergy = 100;
		this.energy = 50;
		this.difficulty = 0;
		this.setRoom(State.Treasure);
	}

	update(time: number, delta: number) {
		if (!this.dialogueOverlay.visible) {
			if (this.state == State.Treasure) {
				this.addEnergy(4 * (delta / 1000));
			} else {
				this.addEnergy(-1 * (delta / 1000));
			}
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

	startDialogue(key: DialogueKey, callback?: (flags: { [key: string]: any }) => void) {
		this.dialogueOverlay.startDialogue(key, callback);
	}

	addEnergy(increment: number) {
		this.energy = Math.min(Math.max(this.energy + increment, 0), 100);

		if (this.energy == 0) {
			this.uiOverlay.triggerPanicAttack();
		} else if (this.energy > 30) {
			this.uiOverlay.clearPanicAttack();
		}
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
		this.musicBacking.mute = muted;
		this.musicGoldPile.mute = muted;
		this.musicHighEnergy.mute = muted;
		this.musicDrumLoop.mute = muted;
		this.musicDanger.mute = muted;
		this.musicStrings.mute = muted;
		this.musicPiano.mute = muted;
		this.musicGuitar.mute = muted;
	}

	setSoundMuted(muted: boolean) {
		this.sound.mute = muted;
	}
}
