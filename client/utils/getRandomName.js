const COLORS = {
  Black: '#000000',
  White: '#FFFFFF',
  Red: '#FF0000',
  Lime: '#00FF00',
  Blue: '#0000FF',
  Yellow: '#FFFF00',
  Cyan: '#00FFFF',
  Magenta: '#FF00FF',
  Silver: '#C0C0C0',
  Gray: '#808080',
  Maroon: '#800000',
  Olive: '#808000',
  Green: '#008000',
  Purple: '#800080',
  Teal: '#008080',
  Navy: '#000080',
};
const ICONS = {
  Bear: 'bear.png',
  BlackJaguar: 'black-jaguar.png',
  Bream: 'bream.png',
  Bull: 'bull.png',
  Butterfly: 'butterfly.png',
  Cat: 'cat.png',
  Chinchilla: 'Chinchilla.png',
  Dog: 'dog.png',
  Duck: 'flying-duck.png',
  Fox: 'fox.png',
  Jaguar: 'ordinary-jaguar.png',
  Panda: 'kiss-panda.png',
  Nautilus: 'nautilus.png',
  Orca: 'orca.png',
  Pelican: 'pelican.png',
  Perch: 'perch.png',
  Pike: 'pike.png',
  Platypus: 'platypus.png',
  Rat: 'rat-silhouette.png',
  RattleSnake: 'rattle-snake.png',
  RedPanda: 'red-panda.png',
  Roach: 'roach.png',
  Seagull: 'seagull.png',
  Shark: 'shark.png',
  Walrus: 'walrus.png',
  Woodpecker: 'woodpecker.png',
};
const LOCAL_STORAGE_CONSTANT = 'demystify';
const RANDOM_NUMBER_LENGTH = 16;

function randomProp(obj) {
  const keys = Object.keys(obj);
  return keys[Math.floor(keys.length * Math.random())];
}

function randomString(length = RANDOM_NUMBER_LENGTH) {
  const result = [];
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result.push(characters.charAt(Math.ceil(Math.random() * charactersLength)));
  }

  return result.join('');
}

function generateRandomName() {
  const colorProp = randomProp(COLORS);
  const iconProp = randomProp(ICONS);
  const randStr = randomString();

  return {
    color: [colorProp, COLORS[colorProp]],
    icon: [iconProp, ICONS[iconProp]],
    uuid: randStr,
  };
}

function getNameObject(localToken) {
  const { color, icon, uuid } = localToken;
  const [colorProp, colorPropValue] = color;
  const [iconProp, iconPropValue] = icon;

  return {
    displayName: `${colorProp} ${iconProp}`,
    actualName: `${colorProp}-${iconProp}-${uuid}`,
    iconPath: `assets/icons/${iconPropValue}`,
    color: colorPropValue,
  };
}

function getRandomName() {
  let localToken = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CONSTANT));
  if (localToken === null) {
    localToken = generateRandomName();
    const value = JSON.stringify(localToken);
    localStorage.setItem(LOCAL_STORAGE_CONSTANT, value);
  }
  return getNameObject(localToken);
}

export default getRandomName;
