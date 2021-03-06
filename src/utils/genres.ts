export enum Genre {
  ELECTRONIC = 'Electronic',
  ROCK = 'Rock',
  METAL = 'Metal',
  ALTERNATIVE = 'Alternative',
  HIP_HOP_RAP = 'Hip-Hop/Rap',
  EXPERIMENTAL = 'Experimental',
  PUNK = 'Punk',
  FOLK = 'Folk',
  POP = 'Pop',
  AMBIENT = 'Ambient',
  SOUNDTRACK = 'Soundtrack',
  WORLD = 'World',
  JAZZ = 'Jazz',
  ACOUSTIC = 'Acoustic',
  FUNK = 'Funk',
  R_AND_B_SOUL = 'R&B/Soul',
  DEVOTIONAL = 'Devotional',
  CLASSICAL = 'Classical',
  REGGAE = 'Reggae',
  PODCASTS = 'Podcasts',
  COUNTRY = 'Country',
  SPOKEN_WORK = 'Spoken Word',
  COMEDY = 'Comedy',
  BLUES = 'Blues',
  KIDS = 'Kids',
  AUDIOBOOKS = 'Audiobooks',
  LATIN = 'Latin',

  // Electronic Subgenres
  TECHNO = 'Techno',
  TRAP = 'Trap',
  HOUSE = 'House',
  TECH_HOUSE = 'Tech House',
  DEEP_HOUSE = 'Deep House',
  DISCO = 'Disco',
  ELECTRO = 'Electro',
  JUNGLE = 'Jungle',
  PROGRESSIVE_HOUSE = 'Progressive House',
  HARDSTYLE = 'Hardstyle',
  GLITCH_HTOP = 'Glitch Hop',
  TRANCE = 'Trance',
  FUTURE_BASE = 'Future Bass',
  FUTURE_HOUSE = 'Future House',
  TROPICAL_HOUSE = 'Tropical House',
  DOWNTEMPO = 'Downtempo',
  DRUM_AND_BASS = 'Drum & Bass',
  DUBSTEP = 'Dubstep',
  JERSEY_CLUB = 'Jersey Club',
  VAPORWARE = 'Vaporwave'
}

export const ELECTRONIC_PREFIX = 'Electronic - '

export const ELECTRONIC_SUBGENRES: { [key in Genre]?: string } = {
  [Genre.TECHNO]: `${ELECTRONIC_PREFIX}Techno`,
  [Genre.TRAP]: `${ELECTRONIC_PREFIX}Trap`,
  [Genre.HOUSE]: `${ELECTRONIC_PREFIX}House`,
  [Genre.TECH_HOUSE]: `${ELECTRONIC_PREFIX}Tech House`,
  [Genre.DEEP_HOUSE]: `${ELECTRONIC_PREFIX}Deep House`,
  [Genre.DISCO]: `${ELECTRONIC_PREFIX}Disco`,
  [Genre.ELECTRO]: `${ELECTRONIC_PREFIX}Electro`,
  [Genre.JUNGLE]: `${ELECTRONIC_PREFIX}Jungle`,
  [Genre.PROGRESSIVE_HOUSE]: `${ELECTRONIC_PREFIX}Progressive House`,
  [Genre.HARDSTYLE]: `${ELECTRONIC_PREFIX}Hardstyle`,
  [Genre.GLITCH_HTOP]: `${ELECTRONIC_PREFIX}Glitch Hop`,
  [Genre.TRANCE]: `${ELECTRONIC_PREFIX}Trance`,
  [Genre.FUTURE_BASE]: `${ELECTRONIC_PREFIX}Future Bass`,
  [Genre.FUTURE_HOUSE]: `${ELECTRONIC_PREFIX}Future House`,
  [Genre.TROPICAL_HOUSE]: `${ELECTRONIC_PREFIX}Tropical House`,
  [Genre.DOWNTEMPO]: `${ELECTRONIC_PREFIX}Downtempo`,
  [Genre.DRUM_AND_BASS]: `${ELECTRONIC_PREFIX}Drum & Bass`,
  [Genre.DUBSTEP]: `${ELECTRONIC_PREFIX}Dubstep`,
  [Genre.JERSEY_CLUB]: `${ELECTRONIC_PREFIX}Jersey Club`,
  [Genre.VAPORWARE]: `${ELECTRONIC_PREFIX}Vaporwave`
}

export const getCannonicalName = (genre: Genre | any) => {
  if (genre in ELECTRONIC_SUBGENRES) return ELECTRONIC_SUBGENRES[genre as Genre]
  return genre
}

export const GENRES = [
  Genre.ELECTRONIC,
  Genre.ROCK,
  Genre.METAL,
  Genre.ALTERNATIVE,
  Genre.HIP_HOP_RAP,
  Genre.EXPERIMENTAL,
  Genre.PUNK,
  Genre.FOLK,
  Genre.POP,
  Genre.AMBIENT,
  Genre.SOUNDTRACK,
  Genre.WORLD,
  Genre.JAZZ,
  Genre.ACOUSTIC,
  Genre.FUNK,
  Genre.R_AND_B_SOUL,
  Genre.DEVOTIONAL,
  Genre.CLASSICAL,
  Genre.REGGAE,
  Genre.PODCASTS,
  Genre.COUNTRY,
  Genre.SPOKEN_WORK,
  Genre.COMEDY,
  Genre.BLUES,
  Genre.KIDS,
  Genre.AUDIOBOOKS,
  Genre.LATIN,
  ...Object.keys(ELECTRONIC_SUBGENRES).map(
    subgenre => `${ELECTRONIC_PREFIX}${subgenre}`
  )
]
