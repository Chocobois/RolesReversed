import { Asset, SpriteSheet, Audio } from './util';
import { image, sound, music, loadFont, spritesheet } from './util';

/* Images */
const images: Asset[] = [
	// Titlescreen
	image('titlescreen/foreground', 'title_foreground'),
	image('titlescreen/background', 'title_background'),
	image('titlescreen/skybackground', 'title_skybackground'),

	// Background images, static
	image('background/outside-room', 'room_outside',),
	image('background/overworld-room', 'room_overworld',),
	image('background/princess-room', 'room_princess',),
	image('background/shop-room', 'room_shop',),
	image('background/sleep-room', 'room_sleep',),
	image('background/town-room', 'room_town',),
	
	image('placeholder/background1', 'background1'),
	image('placeholder/background2', 'background2'),
	image('placeholder/background3', 'background3'),
	image('placeholder/background4', 'background4'),
	image('placeholder/background5', 'background5'),
	image('placeholder/background6', 'background6'),
	image('placeholder/placeholder_scene_invader', 'placeholder_scene_invader'),
	image('placeholder/placeholder_scene_princess', 'placeholder_scene_princess'),
	image('placeholder/placeholder_scene_shop', 'placeholder_scene_shop'),
	image('placeholder/placeholder_scene_sleep', 'placeholder_scene_sleep'),
	image('placeholder/placeholder_ui_close', 'placeholder_ui_close'),
	image('placeholder/placeholder_ui_done', 'placeholder_ui_done'),
	image('placeholder/placeholder_ui_next', 'placeholder_ui_next'),
	image('placeholder/placeholder_ui_prev', 'placeholder_ui_prev'),
	image('placeholder/placeholder_ui_warning1', 'placeholder_ui_warning1'),
	image('placeholder/placeholder_ui_warning2', 'placeholder_ui_warning2'),
];

/* Spritesheets */
const spritesheets: SpriteSheet[] = [

];

/* Audios */
const audios: Audio[] = [
	music('title', 'm_main_menu'),
	music('first', 'm_first'),
	sound('tree/rustle', 't_rustle', 0.5),
];

// await loadFont('DynaPuff-Medium', 'Game Font');

export {
	images,
	spritesheets,
	audios
};