import { LEFT, RIGHT } from 'phaser';

export enum DialogueKey {
	PrincessIntroduction,
	PrincessWantItem,
	PrincessCaughtEscaping,
	HeroIntroduction,
	HeroShout,
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

	BurgerInit,
	BallInit,
	BookInit,
	CakeInit,
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
			sprite: 'hero_big',
			color: Colors.Hero,
			voice: Voices.Hero,
		},
		rightCharacter: {
			sprite: 'dialogue_dragon',
			color: Colors.Dragon,
			voice: Voices.Dragon,
		},
		messages: [
			{
				character: RIGHT,
				text: 'What in heavens is all the racket about.',
			},
			{
				character: LEFT,
				text: 'Any honorable knight must introduce himself.',
			},
			{
				character: LEFT,
				text: 'Alas, you can only hear me from this castle wall.',
			},
			{
				character: RIGHT,
				text: "And why shouldn't I just leave you to tilt at windmills?",
			},
			{
				character: LEFT,
				text: "Like protecting castles, sparring, and pillaging our enemies, whisking away the princess is one of a knight's duties!",
			},
			{
				character: RIGHT,
				text: "Doesn't sound too different from a dragon's life if you ask me.",
			},
			{
				character: LEFT,
				text: 'I detest the comparison, scaly-snout! Be warned, that should you idle too long, I will abduct the fair maiden!',
			},
			{
				character: LEFT,
				text: 'And such a loss would surely be a lethal blow to the pride of a dragon!',
			},
			{
				character: RIGHT,
				text: 'Do you even know her?',
			},
			{
				character: LEFT,
				text: "Most certainly not! But laying claim to damsels in distress is one of a knight's sacred provisions.",
			},
			{
				character: RIGHT,
				text: 'That is actually vile. I should incinerate you on the spot.',
			},
			{
				character: LEFT,
				text: 'It true that you may do so, dragon. But why not engage in a battle of wits?',
			},
			{
				character: LEFT,
				text: 'My brethren will arrive regularly to challenge you. Some may be cowardly, some brave, some greedy, and some noble.',
			},
			{
				character: RIGHT,
				text: 'You can try to scare the weakhearted, bribe the shallow-hearted with your gold, or even seduce those tempted by your draconic nature!',
			},
			{
				character: RIGHT,
				text: 'But beware, misjudge their weakness, and they shall use the opportunity to strike!',
			},
			{
				character: RIGHT,
				text: "Well then, let's try this.",
				choice: [
					{
						text: 'Intimidate',
						color: Colors.Purple,
						messages: [
							{
								character: RIGHT,
								text: "I'll cook you in your tin can.",
							},
							{
								character: LEFT,
								text: 'How clearly frightening! I wish to avoid a demise by baking, and shall take my leave!',
							},
							{
								character: RIGHT,
								text: 'Good riddance.',
								flags: {
									talkFailure: false,
									fried: false,
									paidBribe: false,
									tutorial: true,
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
								text: 'Take my money and leave!',
							},
							{
								character: LEFT,
								text: "Gladly! A serpent's gold is as good as any!",
							},
							{
								character: RIGHT,
								text: 'Augh, what is this vile feeling.',
							},
							{
								character: LEFT,
								text: 'Your pride stings at the sight of tiny men whisking away your hoard! Feel the burn!',
							},
							{
								character: RIGHT,
								text: 'I am already cringing.',
								flags: {
									talkFailure: false,
									fried: false,
									paidBribe: true,
									tutorial: true,
								},
							},
						],
					},
					{
						text: 'Flirt',
						color: Colors.Pink,
						messages: [
							{
								character: RIGHT,
								text: "Hey there, uh, good-lookin'. I like your... big sword?",
							},
							{
								character: LEFT,
								text: 'I hold not a shred of attraction to reptiles like you!',
							},
							{
								character: LEFT,
								text: 'Neither your broad tail, nor your luscious mane, or even your strong, princess-grabbing paws! I shall quit this vile place!',
							},
							{
								character: RIGHT,
								text: 'Ugh, I need a shower.',
								flags: {
									talkFailure: false,
									fried: false,
									paidBribe: false,
									tutorial: true,
								},
							},
						],
					},
					{
						text: 'Kill',
						color: Colors.Red,
						messages: [
							{
								character: RIGHT,
								text: 'Sometimes simple is best. Time to roast.',
							},
							{
								character: LEFT,
								text: 'I appear to have burst into flames. You may win this battle, wyrm, but I will haunt these walls!',
							},
							{
								character: RIGHT,
								text: 'I certainly hope your ghost is quieter.',
								flags: {
									talkFailure: false,
									fried: true,
									paidBribe: false,
									tutorial: true,
								},
							},
						],
					},
				],
			},
		],
	},
	[DialogueKey.HeroBrave]: {
		leftCharacter: {
			sprite: 'hero_charming',
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
			sprite: 'hero_charming',
			color: Colors.RageKnight,
			voice: Voices.Hero,
		},
		rightCharacter: {
			sprite: 'dialogue_dragon',
			color: Colors.Dragon,
			voice: Voices.Dragon,
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
								character: RIGHT,
								text: 'And how much, exactly, is that royal order paying you? I might be convinced to... sweeten the pot.',
							},
							{
								character: LEFT,
								text: 'More than your disgusting hoard is worth to me. Die!',
							},
							{
								character: RIGHT,
								text: 'Augh!',
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
								character: RIGHT,
								text: 'You know, I have a soft spot for rough guys like you. How about we take this behind the lake?',
							},
							{
								character: LEFT,
								text: 'Your lust disgusts me. This one is personal!',
							},
							{
								character: RIGHT,
								text: 'Hrrrk!',
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
								character: RIGHT,
								text: 'Fry, you buffoon.',
							},
							{
								character: LEFT,
								text: 'My flesh- it burns, it burns!',
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
		leftCharacter: {
			sprite: 'hero_skater',
			color: Colors.Hero,
			voice: Voices.Hero,
		},
		rightCharacter: {
			sprite: 'dialogue_dragon',
			color: Colors.Dragon,
			voice: Voices.Dragon,
		},
		messages: [
			{
				character: LEFT,
				text: "Gimme the gurrl pal, or I'm sendin' ya back to the dinosaurs.",
			},
			{
				character: RIGHT,
				text: "Don't you have homework to do?",
			},
			{
				character: LEFT,
				text: "Nah, riches and bitches' all that matters.",
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
								text: "No dice my dude. I've got too much drip, you'd better dip. Eat this!",
							},
							{
								character: RIGHT,
								text: 'Watch it, brat- huuurgh!',
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
								character: RIGHT,
								text: 'Well then, someone of your... flawless moral standards would rather have... a few luxuries.',
							},
							{
								character: LEFT,
								text: 'Whoa, my mom never gives me allowance. You rock dude.',
							},
							{
								character: RIGHT,
								text: "Don't spend it all in one place.",
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
								character: RIGHT,
								text: 'Maidenless.',
							},
							{
								character: LEFT,
								text: 'Stinky.',
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
		leftCharacter: {
			sprite: 'hero_normal',
			color: Colors.CowardKnight,
			voice: Voices.Hero,
		},
		rightCharacter: {
			sprite: 'dialogue_dragon',
			color: Colors.Dragon,
			voice: Voices.Dragon,
		},
		messages: [
			{
				character: LEFT,
				text: 'B-by my name. I will rescue the princess for my lord!',
			},
			{
				character: RIGHT,
				text: 'Are you sure about that?',
			},
			{
				character: LEFT,
				text: "I-I musn't run away! I will be stout as a great oak!",
			},
			{
				character: RIGHT,
				text: 'Ha, well, you look a little scrawny to be rescuing anyone.',
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
								text: "What's that? Maybe you'll speak up a bit when you start burning.",
							},
							{
								character: LEFT,
								text: "I'll.. I'll fight to protect my princess! Whatever it takes!",
							},
							{
								character: RIGHT,
								text: 'YOUR princess? I could turn you to cinders with one puff. Should have brought a bigger sword, hmph!',
							},
							{
								character: LEFT,
								text: "T-that's what I'll do! I'll bring my biggest sword! Then you'll see!",
							},
						],
					},
					{
						text: 'Bribe',
						color: Colors.Gold,
						messages: [
							{
								character: RIGHT,
								text: "How about you scurry home, pipsqueak? I'll even toss you a bit of coin for the road.",
							},
							{
								character: LEFT,
								text: "It's not j-just my body that's trained. M-my honor too! Take that!",
							},
							{
								character: RIGHT,
								text: 'Ouuuaagh!',
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
								character: RIGHT,
								text: "How's Sir Shakes-a-lot say to putting this big scary dragon business aside? I'll show you how to really handle a sword.",
							},
							{
								character: LEFT,
								text: "T-there's nothing I could learn from you. You can't even hold a sword!",
							},
							{
								character: RIGHT,
								text: "I didn't think anyone could be that thick.",
							},
							{
								character: LEFT,
								text: 'I said, give back the princess. Hiyaah!',
							},
							{
								character: RIGHT,
								text: 'Gyuh! What an embarassing mistake...',
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
								character: RIGHT,
								text: "I decided I'm in the mood for some barbecue.",
							},
							{
								character: LEFT,
								text: 'W-wait. N-no, please- aaah! W-water, somebody- AAAAUUUGH!',
							},
							{
								character: RIGHT,
								text: 'Almost feel bad for him.',
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
		leftCharacter: {
			sprite: 'hero_charming',
			color: Colors.Valentine,
			voice: Voices.Hero,
		},
		rightCharacter: {
			sprite: 'dialogue_dragon',
			color: Colors.Dragon,
			voice: Voices.Dragon,
		},
		messages: [
			{
				character: LEFT,
				text: 'The mighty power of love conquers all evil! Bestow to me my princess, wicked dragon!',
				color: Colors.Valentine,
			},
			{
				character: RIGHT,
				text: "Well, someone's spent a bit too long in the alehouse?",
				color: Colors.Dragon,
			},
			{
				character: LEFT,
				text: 'Jest not, wyrm, the swelling passion of my soul has vanquished countless of your kind!',
				color: Colors.Valentine,
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
								text: "I wonder if you'll be just as loud when you're set ablaze.",
								color: Colors.Dragon,
							},
							{
								character: LEFT,
								text: 'The foundation of love is unshakable! I will take your punishment and return with rapturous fury!',
								color: Colors.Valentine,
							},
							{
								character: LEFT,
								text: 'Behold, my heart-crushing grapple! For you, my princess!',
								color: Colors.Valentine,
							},
							{
								character: LEFT,
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
								character: RIGHT,
								text: "You look like you'll have no trouble finding a different princess. How about some gold for the inevitable honeymoon instead?",
								color: Colors.Dragon,
							},
							{
								character: LEFT,
								text: 'My passion is richer than any jewel, and I have no need of your coffers.',
								color: Colors.Valentine,
							},
							{
								character: LEFT,
								text: 'My passion is richer than any jewel, and I have no need of your coffers. Bring to me my princess, my future bride!',
								color: Colors.Valentine,
							},
							{
								character: RIGHT,
								text: 'You really are a clown.',
								color: Colors.Dragon,
							},
							{
								character: LEFT,
								text: 'Your poisonous words are harmless to my admantine heart, and my steel point shall penetrate your dirty scales! En garde!',
								color: Colors.Valentine,
							},
							{
								character: RIGHT,
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
								character: RIGHT,
								text: "A warrior of love, you say? Well, then, why don't you take this big, bad dragon's heart behind the castle this evening?",
								color: Colors.Dragon,
							},
							{
								character: LEFT,
								text: 'A battle of romance, you propose? Well, those lustrous scales and broad wings are quite impressive. I shall not turn this challenge down!',
								color: Colors.Valentine,
							},
							{
								character: RIGHT,
								text: 'Do try to keep pace, lover boy.',
								color: Colors.Dragon,
							},
							{
								character: LEFT,
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
								character: RIGHT,
								text: 'Time for some real fire, Romeo.',
								color: Colors.Dragon,
							},
							{
								character: LEFT,
								text: 'Aaaah! The flames of ecstasy~!',
								color: Colors.Valentine,
							},
							{
								character: RIGHT,
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
		leftCharacter: {
			sprite: 'hero_charming',
			color: Colors.Valentine,
			voice: Voices.Hero,
		},
		rightCharacter: {
			sprite: 'dialogue_dragon',
			color: Colors.Dragon,
			voice: Voices.Dragon,
		},
		messages: [
			{
				character: LEFT,
				text: 'Crawl out of your den, dragon.',
				color: Colors.RageKnight,
			},
		],
	},
	[DialogueKey.sk8rIntro]: {
		leftCharacter: {
			sprite: 'hero_skater',
			color: Colors.Valentine,
			voice: Voices.Hero,
		},
		rightCharacter: {
			sprite: 'dialogue_dragon',
			color: Colors.Dragon,
			voice: Voices.Dragon,
		},
		messages: [
			{
				character: LEFT,
				text: 'Raaadical. Yo, ya home lizard?',
				color: Colors.sk8r,
			},
		],
	},
	[DialogueKey.SquireIntro]: {
		leftCharacter: {
			sprite: 'hero_normal',
			color: Colors.Valentine,
			voice: Voices.Hero,
		},
		rightCharacter: {
			sprite: 'dialogue_dragon',
			color: Colors.Dragon,
			voice: Voices.Dragon,
		},
		messages: [
			{
				character: LEFT,
				text: 'I-is anyone here?',
				color: Colors.CowardKnight,
			},
		],
	},
	[DialogueKey.ValentineIntro]: {
		leftCharacter: {
			sprite: 'hero_charming',
			color: Colors.Valentine,
			voice: Voices.Hero,
		},
		rightCharacter: {
			sprite: 'dialogue_dragon',
			color: Colors.Dragon,
			voice: Voices.Dragon,
		},
		messages: [
			{
				character: LEFT,
				text: 'Hearken to my call dragon!',
				color: Colors.Valentine,
			},
		],
	},
	[DialogueKey.HeroShout]: {
		leftCharacter: {
			sprite: 'hero_big',
			color: Colors.Valentine,
			voice: Voices.Hero,
		},
		rightCharacter: {
			sprite: 'dialogue_dragon',
			color: Colors.Dragon,
			voice: Voices.Dragon,
		},
		messages: [
			{
				character: LEFT,
				text: 'Hearken to my call dragon!',
			},
		],
	},
	[DialogueKey.BurgerInit]: {
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
				text: 'Aw I bet you could stuff these down your gullet for days!',
				choice: [
					{
						text: 'Refuse',
						color: Colors.Red,
						messages: [
							{
								character: LEFT,
								text: 'Are you calling me fat!?',
							},
							{
								character: RIGHT,
								text: 'Hey no shame in having an appetite!',
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
								text: "It's not for me. I have someone to feed.",
							},
							{
								character: RIGHT,
								text: "Sure, I hope ''they'' enjoy it.",
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
	[DialogueKey.BallInit]: {
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
				text: 'Ooh you wanna play with a ball?',
			},
			{
				character: LEFT,
				text: "It's not for me! It's for a princess!",
			},
			{
				character: RIGHT,
				text: "Oh you can't just have one! You need two of these to play with!",
				choice: [
					{
						text: 'Refuse',
						color: Colors.Red,
						messages: [
							{
								character: LEFT,
								text: "On second thought, I don't need it.",
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
								text: 'One will be enough for now.',
							},
							{
								character: RIGHT,
								text: 'Enjoy your purchase!',
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
	[DialogueKey.BookInit]: {
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
				text: "A riveting book! It's all the rage!",
			},
			{
				character: LEFT,
				text: "I've never tried a book before, do I cook it myself?",
			},
			{
				character: RIGHT,
				text: "This isn't Atlanta Nights, it's for reading, not eating!",
				choice: [
					{
						text: 'Refuse',
						color: Colors.Red,
						messages: [
							{
								character: LEFT,
								text: "Add some pictures and I'll reconsider.",
							},
							{
								character: RIGHT,
								text: "Yeah, pay me in exposure while you're at it!",
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
								text: 'Sure, whatever these scribbles mean.',
							},
							{
								character: RIGHT,
								text: "You can't read?",
							},
							{
								character: LEFT,
								text: "I'm getting around to it.",
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
	[DialogueKey.CakeInit]: {
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
				text: 'Proof that my foods class was worth something!',
				choice: [
					{
						text: 'Refuse',
						color: Colors.Red,
						messages: [
							{
								character: LEFT,
								text: 'I hate cake, actually, I prefer pie.',
							},
							{
								character: RIGHT,
								text: 'Wow, a dragon spitting a cold take.',
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
								text: 'At least a princess might enjoy cake.',
							},
							{
								character: RIGHT,
								text: "She expects catering, but I bet she'll love this!",
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
