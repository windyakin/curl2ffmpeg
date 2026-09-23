const NOUNS = [
  'apple', 'arrow', 'autumn', 'badge', 'bamboo', 'beacon', 'bird', 'blossom',
  'breeze', 'bridge', 'brook', 'candle', 'canyon', 'castle', 'cedar', 'cloud',
  'comet', 'coral', 'crane', 'crystal', 'dawn', 'desert', 'dolphin', 'dragon',
  'dream', 'dune', 'eagle', 'ember', 'falcon', 'feather', 'fern', 'field',
  'flame', 'forest', 'fox', 'galaxy', 'garden', 'glacier', 'harbor', 'hawk',
  'hill', 'horizon', 'island', 'jade', 'jungle', 'lake', 'lantern', 'leaf',
  'lemon', 'lighthouse', 'lily', 'lotus', 'maple', 'meadow', 'meteor', 'mirror',
  'moon', 'moss', 'mountain', 'nebula', 'ocean', 'orbit', 'otter', 'owl',
  'panda', 'pearl', 'pebble', 'penguin', 'pine', 'planet', 'pond', 'prism',
  'rabbit', 'rain', 'raven', 'reef', 'river', 'rocket', 'sakura', 'sand',
  'shadow', 'shell', 'sky', 'snow', 'sparrow', 'spring', 'star', 'stone',
  'storm', 'summer', 'sun', 'thunder', 'tiger', 'tulip', 'valley', 'violet',
  'wave', 'whale', 'willow', 'wind', 'winter', 'wolf'
];

const pick = (list, random) => list[Math.floor(random() * list.length)];

// Generate a filename by joining random nouns, e.g. "ocean-lantern-fox.mp4".
export default function randomFilename({ count = 3, extension = 'mp4', random = Math.random } = {}) {
  const words = Array.from({ length: count }, () => pick(NOUNS, random));
  return `${words.join('-')}.${extension}`;
}
