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
	image('background/shop-room', 'room_shop'),
	image('background/sleep-room', 'room_sleep'),
	image('background/town-room', 'room_town'),

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

	// Sprites
	image('sprites/princess', 'princess_default',),
	image('sprites/princess-plead', 'princess_plead',),
	image('sprites/princess-stare', 'princess_stare',),
	image('sprites/princess-laying', 'princess_laying',),
	image('sprites/princess-laying2', 'princess_laying_2',),
	image('sprites/princess-laying3', 'princess_laying_3',),
	image('sprites/princess-escape1', 'princess_escape_1',),
	image('sprites/princess-escape2', 'princess_escape_2',),
	image('sprites/princess-grab', 'princess_grab',),
	//hero
	image('sprites/hero-normal', 'hero_normal',),
	//dragon
	image('sprites/dragon-shop', 'dragon_shop'),

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
const spritesheets: SpriteSheet[] = [spritesheet('ui/audio', 'audio', 300, 300), spritesheet('ui/music', 'music', 300, 300)];

/* Audios */
const audios: Audio[] = [music('title', 'm_main_menu'), music('first', 'm_first'), music('princess', 'm_princess'), music('invader', 'm_invader'), music('treasure', 'm_treasure'), music('shop', 'm_shop'), music('town', 'm_town'), music('overworld', 'm_overworld'), sound('tree/rustle', 't_rustle', 0.5)];

// await loadFont('DynaPuff-Medium', 'Game Font');
// await loadFont('Itim/Itim-Regular', 'Game Font');
// await loadFont('Pangolin/Pangolin-Regular', 'Game Font');
await loadFont('Signika/Signika-VariableFont_wght', 'Game Font');
// await loadFont('Convergence/Convergence-Regular', 'Game Font');

export {
	images,
	spritesheets,
	audios
};