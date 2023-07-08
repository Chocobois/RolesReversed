export enum DialogueKey {
	PrincessIntroduction,
	PrincessWantItem,
	HeroIntroduction,
	HeroBrave,
	ShopIntroduction,
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
				color: '#FF009D',
			},
			{
				right: true,
				text: 'What the fuck...',
				color: '#770000',
			},
			{
				left: true,
				text: "uwu please capture me I've been a NAUGHTY girl! yeah that's right this is a pretty long message.",
				color: '#FF009D',
			},
			{
				right: true,
				text: 'Ok fine come on in gurrrl',
				color: '#770000',
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
};

export function getDialogue(key: DialogueKey) {
	return conversations[key];
}
