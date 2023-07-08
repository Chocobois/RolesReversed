export enum DialogueKey {
	PrincessIntroduction,
	PrincessWantItem,
	HeroIntroduction,
	HeroBrave,
	ShopIntroduction,
	ShopPurchase,
}

enum Colors {
	Dragon = '#770000',
	Princess = '#FF009D',
	Shopkeeper = '#946c35',
}

export interface Message {
	left?: boolean;
	right?: boolean;
	text: string;
	color: string;
	speed?: number;
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
			},
		],
	},
};

export function getDialogue(key: DialogueKey) {
	return conversations[key];
}
