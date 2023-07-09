export enum DialogueKey {
	PrincessIntroduction,
	PrincessWantItem,
	PrincessCaughtEscaping,
	HeroIntroduction,
	HeroBrave,
	ShopIntroduction,
	ShopPurchase,

	KnightText,
	sk8rText,
	SquireText,
}

enum Colors {
	Dragon = '#770000',
	Princess = '#FF009D',
	Shopkeeper = '#946C35',

	Green = '#15803d',
	Red = '#b91c1c',
	Gold = '#ba9b00',
	Pink = '#ff5289',
	Purple = '#cc24ff',
	RageKnight = '#ff1717',
	CowardKnight = '#7000a8',
	sk8r = '#00c4de',
	Valentine = '#d43d7c',
}

enum Voices {
	Shopkeeper = 1,
}

export interface VoiceClipData {
	prefix: string;
	volume: number;
	count: number;
	pitchVar?: number;
	preferred?: number[];
	delay?: number;
}

export const VoiceClips: { [key in Voices]: VoiceClipData } = {
	[Voices.Shopkeeper]: { prefix: 'v_kobl_', volume: 0.5, count: 4, pitchVar: 0.12, preferred: [2, 3, 4, 1], delay: 140 },
};

export interface Message {
	left?: boolean;
	right?: boolean;
	text: string;
	color: Colors;
	voice?: Voices;
	choice?: Choice[];
	flags?: { [key: string]: any };
}

export interface Choice {
	text: string;
	color: Colors;
	messages: Message[];
}

export interface Conversation {
	spriteLeft: string;
	spriteRight: string;
	messages: Message[];
}

const conversations: { [key in DialogueKey]: Conversation } = {
	[DialogueKey.PrincessIntroduction]: {
		spriteLeft: 'dialogue_princess',
		spriteRight: 'dialogue_dragon',
		messages: [
			{
				left: true,
				text: 'Omg hiii dragon-kun~ <3',
				color: Colors.Princess,
			},
			{
				right: true,
				text: 'What the fuck...',
				color: Colors.Dragon,
			},
			{
				left: true,
				text: "uwu please capture me I've been a NAUGHTY girl! yeah that's right this is a pretty long message.",
				color: Colors.Princess,
			},
			{
				right: true,
				text: 'Ok fine come on in gurrrl',
				color: Colors.Dragon,
			},
		],
	},
	[DialogueKey.PrincessWantItem]: {
		spriteLeft: 'dialogue_dragon',
		spriteRight: 'dialogue_dragon',
		messages: [],
	},
	[DialogueKey.PrincessCaughtEscaping]: {
		spriteLeft: 'dialogue_princess',
		spriteRight: 'dialogue_dragon',
		messages: [
			{
				left: true,
				text: 'Haha whoopsie! You caught me.',
				color: Colors.Princess,
			},
			{
				left: true,
				text: 'I was just... stretching my calves on the windowsill.',
				color: Colors.Princess,
				choice: [
					{
						text: 'Scold',
						color: Colors.Red,
						messages: [
							{
								right: true,
								text: "I'm very disappointed in you...",
								color: Colors.Dragon,
							},
							{
								left: true,
								text: '...',
								color: Colors.Princess,
								flags: {
									killsHerself: true,
								},
							},
						],
					},
					{
						text: 'Forgive',
						color: Colors.Green,
						messages: [
							{
								right: true,
								text: "It's ok. Now don't do it again.",
								color: Colors.Dragon,
							},
							{
								left: true,
								text: 'I promiiise~',
								color: Colors.Princess,
							},
						],
					},
				],
			},
		],
	},
	[DialogueKey.HeroIntroduction]: {
		spriteLeft: 'dialogue_hero',
		spriteRight: 'dialogue_dragon',
		messages: [],
	},
	[DialogueKey.HeroBrave]: {
		spriteLeft: 'dialogue_hero',
		spriteRight: 'dialogue_dragon',
		messages: [],
	},
	[DialogueKey.ShopIntroduction]: {
		spriteLeft: 'dialogue_dragon',
		spriteRight: 'dialogue_shopkeeper',
		messages: [],
	},
	[DialogueKey.ShopPurchase]: {
		spriteLeft: 'dialogue_dragon_right',
		spriteRight: 'dialogue_shopkeeper',
		messages: [
			{
				right: true,
				text: 'You wish to buy this?',
				color: Colors.Shopkeeper,
				voice: Voices.Shopkeeper,
			},
			{
				left: true,
				text: 'I HATE spending my precious gold.',
				color: Colors.Dragon,
			},
			{
				left: true,
				text: 'But if I must... The princess demands it.',
				color: Colors.Dragon,
			},
			{
				right: true,
				text: "Yaas queen, that's right. Buy it.",
				color: Colors.Shopkeeper,
				voice: Voices.Shopkeeper,
				choice: [
					{
						text: 'Refuse',
						color: Colors.Red,
						messages: [
							{
								left: true,
								text: "I... I can't. Not my gold.",
								color: Colors.Dragon,
							},
							{
								right: true,
								text: 'Go home and rest.',
								color: Colors.Shopkeeper,
								flags: {
									wantToBuy: false,
								},
							},
						],
					},
					{
						text: 'Buy it',
						color: Colors.Green,
						messages: [
							{
								left: true,
								text: 'Ok fine, take my precious gold.',
								color: Colors.Dragon,
							},
							{
								right: true,
								text: 'Thank you~',
								color: Colors.Shopkeeper,
								flags: {
									wantToBuy: true,
								},
							},
						],
					},
				],
			},
		],
	},
	[DialogueKey.KnightText]: {
		spriteLeft: 'dialogue_dragon_right',
		spriteRight: 'dialogue_shopkeeper',
		messages: [
			{
				left: true,
				text: "You know who I'm here for. Hand her over, and I'll make sure to cut you down quick.",
				color: Colors.RageKnight,
			},
			{
				right: true,
				text: 'You look like someone with absolutely zero friends.',
				color: Colors.Dragon,
			},
			{
				left: true,
				text: "A knight's might is his only friend. I will gut you with pleasure, reptile.",
				color: Colors.RageKnight,
			},
			{
				right: true,
				text: '...',
				color: Colors.Shopkeeper,
				voice: Voices.Shopkeeper,
				choice: [
					{
						text: 'Intimidate',
						color: Colors.Purple,
						messages: [
							{
								right: true,
								text: "Take another step, and I'll boil the flesh off your tiny bones.",
								color: Colors.Dragon,
							},
							{
								left: true,
								text: 'Such a cowardly bluff befits you. Bleed!',
								color: Colors.RageKnight,
								flags: {
									wantToBuy: false,
								},
							},
						],
					},
					{
						text: 'Bribe',
						color: Colors.Gold,
						messages: [
							{
								right: true,
								text: 'And how much, exactly, is that royal order paying you? I might be convinced to... sweeten the pot.',
								color: Colors.Dragon,
							},
							{
								left: true,
								text: 'More than your disgusting hoard is worth to me. Die!',
								color: Colors.RageKnight,
								flags: {
									wantToBuy: true,
								},
							},
							{
								right: true,
								text: 'Augh!',
								color: Colors.Dragon,
							},
						],
					},
					{
						text: 'Flirt',
						color: Colors.Pink,
						messages: [
							{
								right: true,
								text: 'You know, I have a soft spot for rough guys like you. How about we take this behind the lake?',
								color: Colors.Dragon,
							},
							{
								left: true,
								text: 'Your lust disgusts me. This one is personal!',
								color: Colors.RageKnight,
								flags: {
									wantToBuy: true,
								},
							},
							{
								right: true,
								text: 'Hrrrk!',
								color: Colors.Dragon,
							},
						],
					},
					{
						text: 'Kill',
						color: Colors.Red,
						messages: [
							{
								right: true,
								text: 'Fry, you buffoon.',
								color: Colors.Dragon,
							},
							{
								left: true,
								text: 'My flesh- it burns, it burns!',
								color: Colors.RageKnight,
								flags: {
									wantToBuy: true,
								},
							},
						],
					},
				],
			},
		],
	},
	[DialogueKey.sk8rText]: {
		spriteLeft: 'dialogue_dragon_right',
		spriteRight: 'dialogue_shopkeeper',
		messages: [
			{
				left: true,
				text: "Gimme the gurrl pal, or I'm sendin' ya back to the dinosaurs.",
				color: Colors.sk8r,
			},
			{
				right: true,
				text: "Don't you have homework to do?",
				color: Colors.Dragon,
			},
			{
				left: true,
				text: "Nah, riches and bitches' all that matters.",
				color: Colors.sk8r,
			},
			{
				right: true,
				text: '...',
				color: Colors.Shopkeeper,
				voice: Voices.Shopkeeper,
				choice: [
					{
						text: 'Intimidate',
						color: Colors.Purple,
						messages: [
							{
								right: true,
								text: 'Better roll on out of here before I make your family a new jar of ashes.',
								color: Colors.Dragon,
							},
							{
								left: true,
								text: "No dice my dude. I've got too much drip, you'd better dip.",
								color: Colors.sk8r,
								flags: {
									wantToBuy: false,
								},
							},
						],
					},
					{
						text: 'Bribe',
						color: Colors.Gold,
						messages: [
							{
								right: true,
								text: 'Well then, someone of your... flawless moral standards would rather have... a few luxuries.',
								color: Colors.Dragon,
							},
							{
								left: true,
								text: 'Whoa, my mom never gives me allowance. You rock dude.',
								color: Colors.sk8r,
								flags: {
									wantToBuy: true,
								},
							},
							{
								right: true,
								text: 'Augh!',
								color: Colors.Dragon,
							},
						],
					},
					{
						text: 'Insult',
						color: Colors.Pink,
						messages: [
							{
								right: true,
								text: 'Maidenless.',
								color: Colors.Dragon,
							},
							{
								left: true,
								text: 'Stinky.',
								color: Colors.sk8r,
								flags: {
									wantToBuy: true,
								},
							},
						],
					},
					{
						text: 'Kill',
						color: Colors.Red,
						messages: [
							{
								right: true,
								text: 'Burn, pest.',
								color: Colors.Dragon,
							},
							{
								left: true,
								text: 'Aaaaugh! N-not cool...',
								color: Colors.sk8r,
								flags: {
									wantToBuy: true,
								},
							},
							{
								right: true,
								text: 'I hate children.',
								color: Colors.Dragon,
							},
						],
					},
				],
			},
		],
	},
	[DialogueKey.SquireText]: {
		spriteLeft: 'dialogue_dragon_right',
		spriteRight: 'dialogue_shopkeeper',
		messages: [
			{
				left: true,
				text: 'O-on my honor. I will rescue the princess for my lord!',
				color: Colors.sk8r,
			},
			{
				right: true,
				text: 'Are you sure about that?',
				color: Colors.Dragon,
			},
			{
				left: true,
				text: "I-I musn't run away!",
				color: Colors.sk8r,
			},
			{
				right: true,
				text: '...',
				color: Colors.Shopkeeper,
				voice: Voices.Shopkeeper,
				choice: [
					{
						text: 'Intimidate',
						color: Colors.Purple,
						messages: [
							{
								right: true,
								text: 'Better roll on out of here before I make your family a new jar of ashes.',
								color: Colors.Dragon,
							},
							{
								left: true,
								text: "No dice my dude. I've got too much drip, you'd better dip.",
								color: Colors.sk8r,
								flags: {
									wantToBuy: false,
								},
							},
						],
					},
					{
						text: 'Bribe',
						color: Colors.Gold,
						messages: [
							{
								right: true,
								text: 'Well then, someone of your... flawless moral standards would rather have... a few luxuries.',
								color: Colors.Dragon,
							},
							{
								left: true,
								text: 'Whoa, my mom never gives me allowance. You rock dude.',
								color: Colors.sk8r,
								flags: {
									wantToBuy: true,
								},
							},
							{
								right: true,
								text: 'Augh!',
								color: Colors.Dragon,
							},
						],
					},
					{
						text: 'Insult',
						color: Colors.Pink,
						messages: [
							{
								right: true,
								text: 'Maidenless.',
								color: Colors.Dragon,
							},
							{
								left: true,
								text: 'Stinky.',
								color: Colors.sk8r,
								flags: {
									wantToBuy: true,
								},
							},
						],
					},
					{
						text: 'Kill',
						color: Colors.Red,
						messages: [
							{
								right: true,
								text: 'Burn, pest.',
								color: Colors.Dragon,
							},
							{
								left: true,
								text: 'Aaaaugh! N-not cool...',
								color: Colors.sk8r,
								flags: {
									wantToBuy: true,
								},
							},
							{
								right: true,
								text: 'I hate children.',
								color: Colors.Dragon,
							},
						],
					},
				],
			},
		],
	},
};

export function getDialogue(key: DialogueKey) {
	return conversations[key];
}
