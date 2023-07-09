import { Asset, SpriteSheet, Audio } from './util';
import { image, sound, music, loadFont, spritesheet } from './util';

/* Images */
const images: Asset[] = [
	// Titlescreen
	image('titlescreen/title', 'title_title'),
	image('titlescreen/foreground outer', 'title_foreground_outer'),
	image('titlescreen/foreground', 'title_foreground'),
	image('titlescreen/background', 'title_background'),
	image('titlescreen/skybackground', 'title_skybackground'),

	// Background images, static
	image('background/outside-room', 'room_outside'),
	image('background/bg_lol', 'room_overworld_bg'),
	image('background/bg_lol_1', 'overworld_shop'),
	image('background/bg_lol_2', 'overworld_town'),
	image('background/bg_lol_3', 'room_overworld_fg'),
	image('background/princess-room', 'room_princess'),
	image('background/princess-room-escaped', 'room_princess_escaped'),
	image('background/shop-room', 'room_shop'),
	image('background/sleep-room', 'room_sleep'),
	image('background/town_bg', 'town_bg'),
	image('background/town_build_1', 'town_build_1'),
	image('background/town_build_2', 'town_build_2'),
	image('background/town_build_3', 'town_build_3'),
	image('background/town_fg', 'town_fg'),
	image('background/town_rubble_1', 'town_rubble_1'),
	image('background/town_rubble_2', 'town_rubble_2'),
	image('background/town_rubble_3', 'town_rubble_3'),
	image('background/buttons_background', 'buttons_background'),

	//gameover
	image('background/game-over', 'game_over'),
	image('background/game-over-dragon', 'game_over_dragon'),
	image('background/game-over-text', 'game_over_text'),
	image('background/game-over-notext', 'game_over_bg'),

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
	image('sprites/hero-normal-burnt', 'hero_normal_burnt'),
	image('sprites/hero-bigger-sword', 'hero_bigger-sword'),
	image('sprites/hero-sk8r', 'hero_skater'),
	image('sprites/hero-sk8r-burnt', 'hero_skater_burnt'),
	image('sprites/hero-charming', 'hero_charming'),
	image('sprites/hero-charming-burnt', 'hero_charming_burnt'),
	image('sprites/hero-kobold', 'hero_kobold'),
	image('sprites/hero-big', 'hero_big'),
	image('sprites/hero-ash', 'hero_ash'),
	//dragon
	image('sprites/dragon-shop', 'dragon_shop'),
	image('sprites/dragon-sleep', 'dragon_sleep'),
	image('sprites/dragon-sleep-low', 'dragon_sleep_low'),
	image('sprites/dragon-sleep-high', 'dragon_sleep_high'),
	image('sprites/dragon-peek', 'dragon_peek'),
	image('sprites/dragon-peek-flip', 'dragon_peek_flip'),
	//dialogue
	image('sprites/dialogue-empty', 'dialogue_empty'),
	image('sprites/dialogue-dragon', 'dialogue_dragon'),
	image('sprites/dialogue-dragon-angry', 'dialogue_dragon_angry'),
	image('sprites/dialogue-dragon-talk', 'dialogue_dragon_talk'),
	image('sprites/dialogue-dragon-blush', 'dialogue_dragon_blush'),
	image('sprites/dialogue-dragon-right', 'dialogue_dragon_right'),
	image('sprites/dialogue-dragon-angry-right', 'dialogue_dragon_angry_right'),
	image('sprites/dialogue-dragon-talk-right', 'dialogue_dragon_talk_right'),
	image('sprites/dialogue-dragon-blush-right', 'dialogue_dragon_blush_right'),
	image('sprites/dialogue-princess', 'dialogue_princess'),
	image('sprites/dialogue-princess-pout', 'dialogue_princess_pout'),
	image('sprites/dialogue-shopkeeper', 'dialogue_shopkeeper'),
	image('sprites/dialogue-shopkeeper-talk', 'dialogue_shopkeeper_talk'),
	image('sprites/dialogue-goldpile', 'dialogue_goldpile'),

	image('placeholder/placeholder_ui_close', 'placeholder_ui_close'),
	image('placeholder/placeholder_ui_done', 'placeholder_ui_done'),
	image('placeholder/placeholder_ui_next', 'placeholder_ui_next'),
	image('placeholder/placeholder_ui_prev', 'placeholder_ui_prev'),
	image('placeholder/placeholder_ui_warning1', 'placeholder_ui_warning1'),
	image('placeholder/placeholder_ui_warning2', 'placeholder_ui_warning2'),

	image('placeholder/placeholder_building_1', 'BLDG_1'),
	image('placeholder/placeholder_building_2', 'BLDG_2'),
	image('placeholder/placeholder_building_3', 'BLDG_3'),

	image('placeholder/placeholder_expl', 'EXPL'),
	image('sprites/particle-sparkle', 'particle_sparkle'),
];

/* Spritesheets */ /* prettier-ignore */
const spritesheets: SpriteSheet[] = [
	spritesheet('ui/audio', 'audio', 300, 300),
	spritesheet('ui/music', 'music', 300, 300),
	spritesheet('ui/pause', 'pause', 300, 300),
	spritesheet('sprites/particle-sleep', 'particle_sleep', 70, 70),
	spritesheet('sprites/explosion_tiny', 'explosion_tiny', 512, 512),
];

/* Audios */
const audios: Audio[] = [
	// Music
	music('bgm_intro', 'm_main_menu'),
	music('bgm_always', 'm_backing'),
	music('bgm_eepy', 'm_goldpile'),
	music('bgm_drumkit', 'm_highenergy'),
	music('bgm_drumloop', 'm_drumloop'),
	music('bgm_watchout', 'm_danger'),
	music('bgm_strings', 'm_strings'),
	music('bgm_piano', 'm_piano'),
	music('bgm_guitar', 'm_guitar'),
	music('bgm_overwhelm', 'm_critical'),
	music('bgm_gameover', 'm_gameover'),

	// Sounds
	sound('ui/title_begin', 's_begin', 0.5),
	sound('ui/button', 's_button', 0.1),
	sound('ui/tooltip', 's_tooltip', 0.5),
	sound('ui/buy', 's_buy', 0.5),
	sound('ui/collect', 's_collect', 0.5),
	sound('ui/paper', 's_paper', 0.3),
	sound('ui/sparkle', 's_sparkle', 0.3),

	sound('tree/rustle', 't_rustle', 0.1),
	sound('placeholder/placeholder_hit', 'HIT_SOUND', 0.1),
	sound('placeholder/placeholder_capture', 'CAPTURE_SOUND', 0.1),
	sound('placeholder/placeholder_explosion', 'EXPL_SOUND', 0.1),
	sound('placeholder/placeholder_demolish', 'DEMO_SOUND', 0.1),
	sound('placeholder/placeholder_fried', 'FRIED_SOUND', 0.1),
	sound('placeholder/placeholder_scream', 'SCREAM', 0.1),

	// Sounds: character voices
	sound('voice/generic', 'v_misc_1'),

	sound('voice/kobl_1', 'v_kobl_1'),
	sound('voice/kobl_2', 'v_kobl_2'),
	sound('voice/kobl_3', 'v_kobl_3'),
	sound('voice/kobl_4', 'v_kobl_4'),

	sound('voice/dragn_1', 'v_dragn_1'),
	sound('voice/dragn_2', 'v_dragn_2'),
	sound('voice/dragn_3', 'v_dragn_3'),
	sound('voice/dragn_4', 'v_dragn_4'),
	sound('voice/dragn_5', 'v_dragn_5'),
	sound('voice/dragn_6', 'v_dragn_6'),
	sound('voice/dragn_7', 'v_dragn_7'),
	sound('voice/dragn_8', 'v_dragn_8'),
];

// await loadFont('DynaPuff-Medium', 'Game Font');
// await loadFont('Itim/Itim-Regular', 'Game Font');
// await loadFont('Pangolin/Pangolin-Regular', 'Game Font');
await loadFont('Signika/Signika-VariableFont_wght', 'Game Font');
// await loadFont('Convergence/Convergence-Regular', 'Game Font');

export { images, spritesheets, audios };
