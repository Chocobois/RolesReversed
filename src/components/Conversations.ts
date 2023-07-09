import { LEFT, RIGHT } from 'phaser';

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
	Hero = '#0000FF',

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
	Dragon,
	Princess,
	Shopkeeper,
	Hero,
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
	[Voices.Dragon]: {
		prefix: 'v_kobl_',
		volume: 0.5,
		count: 4,
		pitchVar: 0.12,
		preferred: [2, 3, 4, 1],
		delay: 140,
	},
	[Voices.Princess]: {
		prefix: 'v_kobl_',
		volume: 0.5,
		count: 4,
		pitchVar: 0.12,
		preferred: [2, 3, 4, 1],
		delay: 140,
	},
	[Voices.Shopkeeper]: {
		prefix: 'v_kobl_',
		volume: 0.5,
		count: 4,
		pitchVar: 0.12,
		preferred: [2, 3, 4, 1],
		delay: 140,
	},
	[Voices.Hero]: {
		prefix: 'v_kobl_',
		volume: 0.5,
		count: 4,
		pitchVar: 0.12,
		preferred: [2, 3, 4, 1],
		delay: 140,
	},
};

export interface Character {
	sprite: string;
	color: Colors;
	voice: Voices;
}

export interface Message {
	character: number;
	text: string;
	leftSprite?: string;
	rightSprite?: string;
	color?: Colors;
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
	leftCharacter: Character;
	rightCharacter: Character;
	messages: Message[];
}

// const conversations: { [key in DialogueKey]: Conversation } = {
const conversations: { [key in any]: Conversation } = {
	[DialogueKey.PrincessIntroduction]: {
		leftCharacter: {
			sprite: 'dialogue_princess',
			color: Colors.Princess,
			voice: Voices.Princess,
		},
		rightCharacter: {
			sprite: 'dialogue_dragon',
			color: Colors.Dragon,
			voice: Voices.Dragon,
		},
		messages: [
			{
				character: LEFT,
				text: 'Omg hiii dragon-kun~ <3',
			},
			{
				character: RIGHT,
				rightSprite: 'dialogue_dragon_angry',
				text: 'What the fuck...',
			},
			{
				character: LEFT,
				rightSprite: 'dialogue_dragon',
				text: "uwu please capture me I've been a NAUGHTY girl! yeah that's right this is a pretty long message.",
			},
			{
				character: RIGHT,
				rightSprite: 'dialogue_dragon_talk',
				text: 'Ok fine come on in gurrrl',
			},
		],
	},
	[DialogueKey.PrincessWantItem]: {
		leftCharacter: {
			sprite: 'dialogue_princess',
			color: Colors.Princess,
			voice: Voices.Princess,
		},
		rightCharacter: {
			sprite: 'dialogue_dragon',
			color: Colors.Dragon,
			voice: Voices.Dragon,
		},
		messages: [],
	},
	[DialogueKey.PrincessCaughtEscaping]: {
		leftCharacter: {
			sprite: 'dialogue_princess',
			color: Colors.Princess,
			voice: Voices.Princess,
		},
		rightCharacter: {
			sprite: 'dialogue_dragon',
			color: Colors.Dragon,
			voice: Voices.Dragon,
		},
		messages: [
			{
				character: LEFT,
				text: 'Haha whoopsie! You caught me.',
			},
			{
				character: LEFT,
				text: 'I was just... stretching my calves on the windowsill.',
				choice: [
					{
						text: 'Scold',
						color: Colors.Red,
						messages: [
							{
								character: RIGHT,
								text: "I'm very disappointed in you...",
							},
							{
								character: LEFT,
								text: '...',
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
								character: RIGHT,
								text: "It's ok. Now don't do it again.",
							},
							{
								character: LEFT,
								text: 'I promiiise~',
							},
						],
					},
				],
			},
		],
	},
	[DialogueKey.HeroIntroduction]: {
		leftCharacter: {
			sprite: 'dialogue_hero',
			color: Colors.Hero,
			voice: Voices.Hero,
		},
		rightCharacter: {
			sprite: 'dialogue_dragon',
			color: Colors.Dragon,
			voice: Voices.Dragon,
		},
		messages: [],
	},
	[DialogueKey.HeroBrave]: {
		leftCharacter: {
			sprite: 'dialogue_hero',
			color: Colors.Dragon,
			voice: Voices.Dragon,
		},
		rightCharacter: {
			sprite: 'dialogue_dragon',
			color: Colors.Dragon,
			voice: Voices.Dragon,
		},
		messages: [],
	},
	[DialogueKey.ShopIntroduction]: {
		leftCharacter: {
			sprite: 'dialogue_dragon',
			color: Colors.Dragon,
			voice: Voices.Dragon,
		},
		rightCharacter: {
			sprite: 'dialogue_shopkeeper',
			color: Colors.Dragon,
			voice: Voices.Dragon,
		},
		messages: [],
	},
	[DialogueKey.ShopPurchase]: {
		leftCharacter: {
			sprite: 'dialogue_dragon_right',
			color: Colors.Dragon,
			voice: Voices.Dragon,
		},
		rightCharacter: {
			sprite: 'dialogue_shopkeeper',
			color: Colors.Shopkeeper,
			voice: Voices.Shopkeeper,
		},
		messages: [
			{
				character: RIGHT,
				text: 'You wish to buy this?',
			},
			{
				character: LEFT,
				text: 'I HATE spending my precious gold.',
			},
			{
				character: LEFT,
				text: 'But if I must... The princess demands it.',
			},
			{
				character: RIGHT,
				text: "Yaas queen, that's right. Buy it.",
				voice: Voices.Shopkeeper,
				choice: [
					{
						text: 'Refuse',
						color: Colors.Red,
						messages: [
							{
								character: LEFT,
								text: "I... I can't. Not my gold.",
							},
							{
								character: RIGHT,
								text: 'Go home and rest.',
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
								character: LEFT,
								text: 'Ok fine, take my precious gold.',
							},
							{
								character: RIGHT,
								text: 'Thank you~',
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
		leftCharacter: {
			sprite: 'dialogue_dragon_right',
			color: Colors.Dragon,
			voice: Voices.Dragon,
		},
		rightCharacter: {
			sprite: 'dialogue_hero',
			color: Colors.RageKnight,
			voice: Voices.Hero,
		},
		messages: [
			{
				character: LEFT,
				text: "You know who I'm here for. Hand her over, and I'll make sure to cut you down quick.",
			},
			{
				character: RIGHT,
				text: 'You look like someone with absolutely zero friends.',
			},
			{
				character: LEFT,
				text: "A knight's might is his only friend. I will gut you with pleasure, reptile.",
			},
			{
				character: RIGHT,
				text: '...',
				voice: Voices.Shopkeeper,
				choice: [
					{
						text: 'Intimidate',
						color: Colors.Purple,
						messages: [
							{
								character: RIGHT,
								text: "Take another step, and I'll boil the flesh off your tiny bones.",
							},
							{
								character: LEFT,
								text: 'Such a cowardly bluff befits you. Bleed!',
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
								character: RIGHT,
								text: 'And how much, exactly, is that royal order paying you? I might be convinced to... sweeten the pot.',
							},
							{
								character: LEFT,
								text: 'More than your disgusting hoard is worth to me. Die!',
								flags: {
									wantToBuy: true,
								},
							},
							{
								character: RIGHT,
								text: 'Augh!',
							},
						],
					},
					{
						text: 'Flirt',
						color: Colors.Pink,
						messages: [
							{
								character: RIGHT,
								text: 'You know, I have a soft spot for rough guys like you. How about we take this behind the lake?',
								color: Colors.Dragon,
							},
							{
								character: LEFT,
								text: 'Your lust disgusts me. This one is personal!',
								color: Colors.RageKnight,
								flags: {
									wantToBuy: true,
								},
							},
							{
								character: RIGHT,
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
								character: RIGHT,
								text: 'Fry, you buffoon.',
								color: Colors.Dragon,
							},
							{
								character: LEFT,
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
		leftCharacter: {
			sprite: 'dialogue_dragon_right',
			color: Colors.Dragon,
			voice: Voices.Dragon,
		},
		rightCharacter: {
			sprite: 'hero_skater',
			color: Colors.Hero,
			voice: Voices.Hero,
		},
		messages: [
			{
				character: LEFT,
				text: "Gimme the gurrl pal, or I'm sendin' ya back to the dinosaurs.",
				color: Colors.sk8r,
			},
			{
				character: RIGHT,
				text: "Don't you have homework to do?",
				color: Colors.Dragon,
			},
			{
				character: LEFT,
				text: "Nah, riches and bitches' all that matters.",
				color: Colors.sk8r,
			},
			{
				character: RIGHT,
				text: '...',
				color: Colors.Shopkeeper,
				voice: Voices.Shopkeeper,
				choice: [
					{
						text: 'Intimidate',
						color: Colors.Purple,
						messages: [
							{
								character: RIGHT,
								text: 'Better roll on out of here before I make your family a new jar of ashes.',
								color: Colors.Dragon,
							},
							{
								character: LEFT,
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
								character: RIGHT,
								text: 'Well then, someone of your... flawless moral standards would rather have... a few luxuries.',
								color: Colors.Dragon,
							},
							{
								character: LEFT,
								text: 'Whoa, my mom never gives me allowance. You rock dude.',
								color: Colors.sk8r,
							},
							{
								character: RIGHT,
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
								character: RIGHT,
								text: 'Maidenless.',
								color: Colors.Dragon,
							},
							{
								character: LEFT,
								text: 'Stinky.',
								color: Colors.sk8r,
							},
						],
					},
					{
						text: 'Kill',
						color: Colors.Red,
						messages: [
							{
								character: RIGHT,
								text: 'Burn, pest.',
								color: Colors.Dragon,
							},
							{
								character: LEFT,
								text: 'Aaaaugh! N-not cool...',
								color: Colors.sk8r,
							},
							{
								character: RIGHT,
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
		leftCharacter: {
			sprite: 'dialogue_hero',
			color: Colors.CowardKnight,
			voice: Voices.Hero,
		},
		rightCharacter: {
			sprite: 'dialogue_dragon_right',
			color: Colors.Dragon,
			voice: Voices.Dragon,
		},
		messages: [
			{
				character: LEFT,
				text: 'O-on my honor. I will rescue the princess for my lord!',
			},
			{
				character: RIGHT,
				text: 'Are you sure about that?',
			},
			{
				character: LEFT,
				text: "I-I musn't run away!",
			},
			{
				character: RIGHT,
				text: '...',
				choice: [
					{
						text: 'Intimidate',
						color: Colors.Purple,
						messages: [
							{
								character: RIGHT,
								text: 'Better roll on out of here before I make your family a new jar of ashes.',
							},
							{
								character: LEFT,
								text: "No dice my dude. I've got too much drip, you'd better dip.",
							},
						],
					},
					{
						text: 'Bribe',
						color: Colors.Gold,
						messages: [
							{
								character: RIGHT,
								text: 'Well then, someone of your... flawless moral standards would rather have... a few luxuries.',
							},
							{
								character: LEFT,
								text: 'Whoa, my mom never gives me allowance. You rock dude.',
							},
							{
								character: RIGHT,
								text: 'Augh!',
							},
						],
					},
					{
						text: 'Insult',
						color: Colors.Pink,
						messages: [
							{
								character: RIGHT,
								text: 'Maidenless.',
							},
							{
								character: LEFT,
								text: 'Stinky.',
							},
						],
					},
					{
						text: 'Kill',
						color: Colors.Red,
						messages: [
							{
								character: RIGHT,
								text: 'Burn, pest.',
							},
							{
								character: LEFT,
								text: 'Aaaaugh! N-not cool...',
							},
							{
								character: RIGHT,
								text: 'I hate children.',
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
