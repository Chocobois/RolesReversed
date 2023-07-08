import { BaseScene } from './BaseScene';
import State from '@/components/State';
import { Music } from '@/components/Music';

import { PrincessRoom } from '@/rooms/PrincessRoom';
import { InvaderRoom } from '@/rooms/InvaderRoom';
import { TreasureRoom } from '@/rooms/TreasureRoom';
import { ShopRoom } from '@/rooms/ShopRoom';
import { TownRoom } from '@/rooms/TownRoom';
import { OverworldRoom } from '@/rooms/OverworldRoom';

import { UIOverlay } from '@/components/UIOverlay';

export class GameScene extends BaseScene {
	public background: Phaser.GameObjects.Image;

	public state: State;
	private princessRoom: PrincessRoom;
	private invaderRoom: InvaderRoom;
	private treasureRoom: TreasureRoom;
	private shopRoom: ShopRoom;
	private townRoom: TownRoom;
	private overworldRoom: OverworldRoom;

	private uiOverlay: UIOverlay;
	private debugText: Phaser.GameObjects.Text;

	public money: number;

	// Music
	public musicPrincess: Music;
	public musicInvader: Music;
	public musicTreasure: Music;
	public musicShop: Music;
	public musicTown: Music;
	public musicOverworld: Music;
	public musicVolume: number;

	constructor() {
		super({ key: 'GameScene' });
	}

	create(): void {
		this.fade(false, 200, 0x000000);

		this.princessRoom = new PrincessRoom(this);
		this.invaderRoom = new InvaderRoom(this);
		this.treasureRoom = new TreasureRoom(this);
		this.shopRoom = new ShopRoom(this);
		this.townRoom = new TownRoom(this);
		this.overworldRoom = new OverworldRoom(this);

		this.uiOverlay = new UIOverlay(this);
		this.uiOverlay.on('changeRoom', this.setRoom, this);

		this.debugText = this.createText(0, 0, 50, 'black');

		this.setRoom(State.Princess);

		this.money = 0;

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
	}

	update(time: number, delta: number) {
		this.princessRoom.update(time, delta);
		this.invaderRoom.update(time, delta);
		this.treasureRoom.update(time, delta);
		this.shopRoom.update(time, delta);
		this.townRoom.update(time, delta);
		this.overworldRoom.update(time, delta);

		this.uiOverlay.update(time, delta);

		this.debugText.setText(this.princessRoom.getDebugText());
	}

	setRoom(state: State) {
		this.state = state;
		this.uiOverlay.setRoom(state);

		this.princessRoom.setVisible(state == State.Princess);
		this.invaderRoom.setVisible(state == State.Invader);
		this.treasureRoom.setVisible(state == State.Treasure);
		this.shopRoom.setVisible(state == State.Shop);
		this.townRoom.setVisible(state == State.Town);
		this.overworldRoom.setVisible(state == State.Overworld);
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
