import { Asset, SpriteSheet, Audio } from './util';
import { image, sound, music, loadFont, spritesheet } from './util';

/* Images */
const images: Asset[] = [
	// Titlescreen
	image('titlescreen/foreground', 'title_foreground'),
	image('titlescreen/background', 'title_background'),
	image('titlescreen/skybackground', 'title_skybackground'),

	// Background images, static
	image('background/outside-room', 'room_outside'),
	image('background/overworld-room', 'room_overworld'),
	image('background/princess-room', 'room_princess'),
	image('background/princess-room-escaped', 'room_princess-escaped'),
	image('background/shop-room', 'room_shop'),
	image('background/sleep-room', 'room_sleep'),
	image('background/town-room', 'room_town'),
	image('placeholder/gameover', 'game_over'),

	// UI
	image('ui/outside', 'button_outside'),
	image('ui/overworld', 'button_overworld'),
	image('ui/princess', 'button_princess'),
	image('ui/sleep', 'button_sleep'),
	image('ui/home', 'button_home'),
	image('ui/shop', 'button_shop'),
	image('ui/town', 'button_town'),
	image('ui/ring', 'button_ring_off'),
	image('ui/ring2', 'button_ring_on'),
	image('ui/shop_buy_button', 'button_shop_buy'),
	image('ui/notification-danger', 'button_notification_danger'),
	image('ui/notification-question', 'button_notification_question'),
	image('ui/notification-sleeping', 'button_notification_sleeping'),
	image('ui/notification-dead', 'button_notification_dead'),
	image('ui/speechbubble-small', 'speechbubble_small'),
	image('ui/down_arrow', 'down_arrow'),
	image('ui/screen_gradient', 'screen_gradient'),

	// Sprites
	image('sprites/princess', 'princess_default'),
	image('sprites/princess-plead', 'princess_plead'),
	image('sprites/princess-stare', 'princess_stare'),
	image('sprites/princess-laying', 'princess_laying'),
	image('sprites/princess-laying2', 'princess_laying_2'),
	image('sprites/princess-laying3', 'princess_laying_3'),
	image('sprites/princess-escape1', 'princess_escape_1'),
	image('sprites/princess-escape2', 'princess_escape_2'),
	image('sprites/princess-grab', 'princess_grab'),
	image('sprites/princess-read', 'princess_read'),
	image('sprites/princess-play', 'princess_play'),
	image('sprites/princess-eat-empty', 'princess_eat_empty'),
	image('sprites/princess-eat-burger', 'princess_eat_burger'),
	image('sprites/princess-eat-cake', 'princess_eat_cake'),

	//items
	image('sprites/item-book', 'item_book'),
	image('sprites/item-toy', 'item_toy'),
	image('sprites/item-burger', 'item_burger'),
	image('sprites/item-cake', 'item_cake'),
	//shop
	image('sprites/shop', 'shop'),
	image('sprites/shop_bg', 'shop_bg'),
	image('sprites/shop_desk', 'shop_desk'),
	image('sprites/shop_kobold', 'shop_kobold'),
	image('sprites/shop_tail', 'shop_tail'),
	image('sprites/shop-pole', 'shop_pole'),
	//hero
	image('sprites/hero-princess', 'hero_princess'),
	image('sprites/hero-normal', 'hero_normal'),
	image('sprites/hero-sk8r', 'hero_skater'),
	image('sprites/hero-charming', 'hero_charming'),
	image('sprites/hero-kobold', 'hero_kobold'),
	//dragon
	image('sprites/dragon-shop', 'dragon_shop'),
	image('sprites/dragon-sleep', 'dragon_sleep'),
	image('sprites/dragon-sleep-low', 'dragon_sleep_low'),
	image('sprites/dragon-sleep-high', 'dragon_sleep_high'),
	//overworld
	image('sprites/overworld-shop', 'overworld_shop'),
	image('sprites/overworld-town', 'overworld_town'),
	//dialogue
	image('sprites/dialogue-dragon', 'dialogue_dragon'),
	image('sprites/dialogue-dragon-angry', 'dialogue_dragon_angry'),
	image('sprites/dialogue-dragon-talk', 'dialogue_dragon_talk'),
	image('sprites/dialogue-dragon-blush', 'dialogue_dragon_blush'),
	image('sprites/dialogue-dragon-right', 'dialogue_dragon_right'),
	image('sprites/dialogue-dragon-angry-right', 'dialogue_dragon_angry_right'),
	image('sprites/dialogue-dragon-talk-right', 'dialogue_dragon_talk_right'),
	image('sprites/dialogue-dragon-blush-right', 'dialogue_dragon_blush_right'),
	image('sprites/dialogue-hero', 'dialogue_hero'),
	image('sprites/dialogue-princess', 'dialogue_princess'),
	image('sprites/dialogue-princess-pout', 'dialogue_princess_pout'),
	image('sprites/dialogue-shopkeeper', 'dialogue_shopkeeper'),

	image('placeholder/placeholder_ui_close', 'placeholder_ui_close'),
	image('placeholder/placeholder_ui_done', 'placeholder_ui_done'),
	image('placeholder/placeholder_ui_next', 'placeholder_ui_next'),
	image('placeholder/placeholder_ui_prev', 'placeholder_ui_prev'),
	image('placeholder/placeholder_ui_warning1', 'placeholder_ui_warning1'),
	image('placeholder/placeholder_ui_warning2', 'placeholder_ui_warning2'),

	image('placeholder/placeholder_sleazy', 'hero_sleazy'),
	image('placeholder/placeholder_building_1', 'BLDG_1'),
	image('placeholder/placeholder_building_2', 'BLDG_2'),
	image('placeholder/placeholder_building_3', 'BLDG_3'),

	image('placeholder/placeholder_expl', 'EXPL'),
];

/* Spritesheets */ // prettier-ignore
const spritesheets: SpriteSheet[] = [
	spritesheet('ui/audio', 'audio', 300, 300),
	spritesheet('ui/music', 'music', 300, 300),
	spritesheet('ui/pause', 'pause', 300, 300),
];

/* Audios */
const audios: Audio[] = [
	// Music
	music('title', 'm_main_menu'),
	music('first', 'm_first'),
	music('princess', 'm_princess'),
	music('invader', 'm_invader'),
	music('treasure', 'm_treasure'),
	music('shop', 'm_shop'),
	music('town', 'm_town'),
	music('overworld', 'm_overworld'),

	// Sounds
	sound('tree/rustle', 't_rustle', 0.1),
	sound('placeholder/gameover_sound', 'GAME_OVER_SOUND', 0.1),
	sound('placeholder/placeholder_hit', 'HIT_SOUND', 0.1),
	sound('placeholder/placeholder_capture', 'CAPTURE_SOUND', 0.1),
	sound('placeholder/explosion_placeholder', 'EXPL_SOUND', 0.1),
	sound('placeholder/placeholder_demolish', 'DEMO_SOUND', 0.1),
	// Sounds: character voices
	sound('voice/kobl_1', 'v_kobl_1'),
	sound('voice/kobl_2', 'v_kobl_2'),
	sound('voice/kobl_3', 'v_kobl_3'),
	sound('voice/kobl_4', 'v_kobl_4'),
];

// await loadFont('DynaPuff-Medium', 'Game Font');
// await loadFont('Itim/Itim-Regular', 'Game Font');
// await loadFont('Pangolin/Pangolin-Regular', 'Game Font');
await loadFont('Signika/Signika-VariableFont_wght', 'Game Font');
// await loadFont('Convergence/Convergence-Regular', 'Game Font');

export { images, spritesheets, audios };
