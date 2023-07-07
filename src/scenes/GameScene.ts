import { BaseScene } from "./BaseScene";
import State from "@/components/State";
import { Music } from "@/components/Music";

import { PrincessRoom } from "@/rooms/PrincessRoom";
import { InvaderRoom } from "@/rooms/InvaderRoom";
import { TreasureRoom } from "@/rooms/TreasureRoom";
import { ShopRoom } from "@/rooms/ShopRoom";
import { TownRoom } from "@/rooms/TownRoom";
import { OverworldRoom } from "@/rooms/OverworldRoom";

import { UIOverlay } from "@/components/UIOverlay";


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


	constructor() {
		super({ key: "GameScene" });
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
		this.uiOverlay.on("changeRoom", this.setState, this);

		this.setState(State.Princess);
	}

	update(time: number, delta: number) {
		this.princessRoom.update(time, delta);
		this.invaderRoom.update(time, delta);
		this.treasureRoom.update(time, delta);
		this.shopRoom.update(time, delta);
		this.townRoom.update(time, delta);
		this.overworldRoom.update(time, delta);

		this.uiOverlay.update(time, delta);
	}

	setState(state: State) {
		this.state = state;

		this.princessRoom.setVisible(state == State.Princess);
		this.invaderRoom.setVisible(state == State.Invader);
		this.treasureRoom.setVisible(state == State.Treasure);
		this.shopRoom.setVisible(state == State.Shop);
		this.townRoom.setVisible(state == State.Town);
		this.overworldRoom.setVisible(state == State.Overworld);
	}
}