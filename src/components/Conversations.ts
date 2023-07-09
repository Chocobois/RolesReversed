export enum DialogueKey {
	PrincessIntroduction,
	PrincessWantItem,
	PrincessCaughtEscaping,
	HeroIntroduction,
	HeroBrave,
	ShopIntroduction,
	ShopPurchase,
}

enum Colors {
	Dragon = '#770000',
	Princess = '#FF009D',
	Shopkeeper = '#946C35',

	Green = '#15803d',
	Red = '#b91c1c',
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
};

export function getDialogue(key: DialogueKey) {
	return conversations[key];
}
