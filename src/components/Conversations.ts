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
	ValentineText,

	KnightIntro,
	sk8rIntro,
	SquireIntro,
	ValentineIntro,
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
		spriteLeft: 'hero_sleazy',
		spriteRight: 'dialogue_dragon',
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
									talkFailure: true,
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
							},
							{
								right: true,
								text: 'Augh!',
								color: Colors.Dragon,
								flags: {
									talkFailure: true,
								},
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
							},
							{
								right: true,
								text: 'Hrrrk!',
								color: Colors.Dragon,
								flags: {
									talkFailure: true,
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
								text: 'Fry, you buffoon.',
								color: Colors.Dragon,
							},
							{
								left: true,
								text: 'My flesh- it burns, it burns!',
								color: Colors.RageKnight,
								flags: {
									fried: true,
								},
							},
						],
					},
				],
			},
		],
	},
	[DialogueKey.sk8rText]: {
		spriteLeft: 'hero_skater',
		spriteRight: 'dialogue_dragon',
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
								text: "No dice my dude. I've got too much drip, you'd better dip. Eat this!",
								color: Colors.sk8r,
							},
							{
								right: true,
								text: 'Watch it, brat- huuurgh!',
								color: Colors.Dragon,
								flags: {
									talkFailure: true,
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
							},
							{
								right: true,
								text: "Don't spend it all in one place.",
								color: Colors.Dragon,
								flags: {
									payBribe: true,
								},
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
									talkFailure: true,
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
							},
							{
								right: true,
								text: 'I hate children.',
								color: Colors.Dragon,
								flags: {
									fried: true,
								},
							},
						],
					},
				],
			},
		],
	},
	[DialogueKey.SquireText]: {
		spriteLeft: 'hero_normal',
		spriteRight: 'dialogue_dragon',
		messages: [
			{
				left: true,
				text: 'B-by my name. I will rescue the princess for my lord!',
				color: Colors.CowardKnight,
			},
			{
				right: true,
				text: 'Are you sure about that?',
				color: Colors.Dragon,
			},
			{
				left: true,
				text: "I-I musn't run away! I will be stout as a great oak!",
				color: Colors.CowardKnight,
			},
			{
				right: true,
				text: 'Ha, well, you look a little scrawny to be rescuing anyone.',
				color: Colors.Dragon,
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
								text: "What's that? Maybe you'll speak up a bit when you start burning.",
								color: Colors.Dragon,
							},
							{
								left: true,
								text: "I'll.. I'll fight to protect my princess! Whatever it takes!",
								color: Colors.CowardKnight,
							},
							{
								right: true,
								text: 'YOUR princess? I could turn you to cinders with one puff. Should have brought a bigger sword, hmph!',
								color: Colors.Dragon,
							},
							{
								left: true,
								text: "T-that's what I'll do! I'll bring my biggest sword! Then you'll see!",
								color: Colors.CowardKnight,
							},
						],
					},
					{
						text: 'Bribe',
						color: Colors.Gold,
						messages: [
							{
								right: true,
								text: "How about you scurry home, pipsqueak? I'll even toss you a bit of coin for the road.",
								color: Colors.Dragon,
							},
							{
								left: true,
								text: "It's not j-just my body that's trained. M-my honor too! Take that!",
								color: Colors.CowardKnight,
							},
							{
								right: true,
								text: 'Ouuuaagh!',
								color: Colors.Dragon,
								flags: {
									talkFailure: true,
								},
							},
						],
					},
					{
						text: 'Flirt',
						color: Colors.Pink,
						messages: [
							{
								right: true,
								text: "How's Sir Shakes-a-lot say to putting this big scary dragon business aside? I'll show you how to really handle a sword.",
								color: Colors.Dragon,
							},
							{
								left: true,
								text: "T-there's nothing I could learn from you. You can't even hold a sword!",
								color: Colors.CowardKnight,
							},
							{
								right: true,
								text: "I didn't think anyone could be that thick.",
								color: Colors.Dragon,
							},
							{
								left: true,
								text: 'I said, give back the princess. Hiyaah!',
								color: Colors.CowardKnight,
							},
							{
								right: true,
								text: 'Gyuh! What an embarassing mistake...',
								color: Colors.Dragon,
								flags: {
									talkFailure: true,
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
								text: "I decided I'm in the mood for some barbecue.",
								color: Colors.Dragon,
							},
							{
								left: true,
								text: 'W-wait. N-no, please- aaah! W-water, somebody- AAAAUUUGH!',
								color: Colors.CowardKnight,
							},
							{
								right: true,
								text: 'Almost feel bad for him.',
								color: Colors.Dragon,
								flags: {
									fried: true,
								},
							},
						],
					},
				],
			},
		],
	},
	[DialogueKey.ValentineText]: {
		spriteLeft: 'hero_charming',
		spriteRight: 'dialogue_dragon',
		messages: [
			{
				left: true,
				text: 'The mighty power of love conquers all evil! Bestow to me my princess, wicked dragon!',
				color: Colors.Valentine,
			},
			{
				right: true,
				text: "Well, someone's spent a bit too long in the alehouse?",
				color: Colors.Dragon,
			},
			{
				left: true,
				text: 'Jest not, wyrm, the swelling passion of my soul has vanquished countless of your kind!',
				color: Colors.Valentine,
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
								text: "I wonder if you'll be just as loud when you're set ablaze.",
								color: Colors.Dragon,
							},
							{
								left: true,
								text: 'The foundation of love is unshakable! I will take your punishment and return with rapturous fury!',
								color: Colors.Valentine,
							},
							{
								left: true,
								text: 'Behold, my heart-crushing grapple! For you, my princess!',
								color: Colors.Valentine,
							},
							{
								left: true,
								text: 'Huh? Uuuuuuorgh!',
								color: Colors.Dragon,
								flags: {
									talkFailure: true,
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
								text: "You look like you'll have no trouble finding a different princess. How about some gold for the inevitable honeymoon instead?",
								color: Colors.Dragon,
							},
							{
								left: true,
								text: 'My passion is richer than any jewel, and I have no need of your coffers.',
								color: Colors.Valentine,
							},
							{
								left: true,
								text: 'My passion is richer than any jewel, and I have no need of your coffers. Bring to me my princess, my future bride!',
								color: Colors.Valentine,
							},
							{
								right: true,
								text: 'You really are a clown.',
								color: Colors.Dragon,
							},
							{
								left: true,
								text: 'Your poisonous words are harmless to my admantine heart, and my steel point shall penetrate your dirty scales! En garde!',
								color: Colors.Valentine,
							},
							{
								right: true,
								text: 'Auuugh! Uuurhh...',
								color: Colors.Dragon,
								flags: {
									talkFailure: true,
								},
							},
						],
					},
					{
						text: 'Flirt',
						color: Colors.Pink,
						messages: [
							{
								right: true,
								text: "A warrior of love, you say? Well, then, why don't you take this big, bad dragon's heart behind the castle this evening?",
								color: Colors.Dragon,
							},
							{
								left: true,
								text: 'A battle of romance, you propose? Well, those lustrous scales and broad wings are quite impressive. I shall not turn this challenge down!',
								color: Colors.Valentine,
							},
							{
								right: true,
								text: 'Do try to keep pace, lover boy.',
								color: Colors.Dragon,
							},
							{
								left: true,
								text: 'Prepare to be utterly ravished, on my honor as a knight!',
								color: Colors.Valentine,
							},
						],
					},
					{
						text: 'Kill',
						color: Colors.Red,
						messages: [
							{
								right: true,
								text: 'Time for some real fire, Romeo.',
								color: Colors.Dragon,
							},
							{
								left: true,
								text: 'Aaaah! The flames of ecstasy~!',
								color: Colors.Valentine,
							},
							{
								right: true,
								text: 'Ew.',
								color: Colors.Dragon,
								flags: {
									fried: true,
								},
							},
						],
					},
				],
			},
		],
	},
	[DialogueKey.KnightIntro]: {
		spriteLeft: 'hero_sleazy',
		spriteRight: 'dialogue_dragon',
		messages: [
			{
				left: true,
				text: 'Crawl out of your den, dragon.',
				color: Colors.RageKnight,
			},
		],
	},
	[DialogueKey.sk8rIntro]: {
		spriteLeft: 'hero_skater',
		spriteRight: 'dialogue_dragon',
		messages: [
			{
				left: true,
				text: 'Raaadical. Yo, ya home lizard?',
				color: Colors.sk8r,
			},
		],
	},
	[DialogueKey.SquireIntro]: {
		spriteLeft: 'hero_normal',
		spriteRight: 'dialogue_dragon',
		messages: [
			{
				left: true,
				text: 'I-is anyone here?',
				color: Colors.CowardKnight,
			},
		],
	},
	[DialogueKey.ValentineIntro]: {
		spriteLeft: 'hero_charming',
		spriteRight: 'dialogue_dragon',
		messages: [
			{
				left: true,
				text: 'Hearken to my call dragon!',
				color: Colors.Valentine,
			},
		],
	},
};

export function getDialogue(key: DialogueKey) {
	return conversations[key];
}
