const overlap = 2;

const Data = {
	m_main_menu: {
		offset: 0.424,
		bpm: 60,
	},
	m_backing: {
		offset: 1 / (170 / 60),
		bpm: 170,
		loop: true,
		start: 514763 / 44100 + overlap,
		end: 2506847 / 44100 + overlap,
	},
	m_goldpile: {
		offset: 1 / (170 / 60),
		bpm: 170,
		loop: true,
		start: 514763 / 44100 + overlap,
		end: 2506847 / 44100 + overlap,
	},
	m_highenergy: {
		offset: 1 / (170 / 60),
		bpm: 170,
		loop: true,
		start: 514763 / 44100 + overlap,
		end: 2506847 / 44100 + overlap,
	},
	m_drumloop: {
		offset: 1 / (170 / 60),
		bpm: 170,
		loop: true,
		start: 514763 / 44100 + overlap,
		end: 2506847 / 44100 + overlap,
	},
	m_danger: {
		offset: 1 / (170 / 60),
		bpm: 170,
		loop: true,
		start: 514763 / 44100 + overlap,
		end: 2506847 / 44100 + overlap,
	},
	m_strings: {
		offset: 1 / (170 / 60),
		bpm: 170,
		loop: true,
		start: 514763 / 44100 + overlap,
		end: 2506847 / 44100 + overlap,
	},
	m_piano: {
		offset: 1 / (170 / 60),
		bpm: 170,
		loop: true,
		start: 514763 / 44100 + overlap,
		end: 2506847 / 44100 + overlap,
	},
	m_guitar: {
		offset: 1 / (170 / 60),
		bpm: 170,
		loop: true,
		start: 514763 / 44100 + overlap,
		end: 2506847 / 44100 + overlap,
	},
	m_gameover: {
		offset: 0,
		bpm: 170,
		loop: false,
		start: 0,
		end: 1993439 / 44100,
	},
};

export type MusicKey = keyof typeof Data;
export type MusicDataType = {
	[K in MusicKey]: {
		offset: number
		bpm: number
		loop: boolean
		start: number
		end: number
	}
}

export default Data as MusicDataType;