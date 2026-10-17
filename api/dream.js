// api/dream.js — Pip's Generative Bedtime Dream Engine (Vercel Serverless Function)

const dreamTemplates = {
  cozy: {
    titles: [
      "The Marshmallow Blanket Fort",
      "Cup of Warm Berry Milk",
      "The Purring Cloud Slumber"
    ],
    stories: [
      "Pip built a soft den out of puffy marshmallow clouds and wrapped you in a quilt stitched from starlight.",
      "A tiny tea kettle on Pip's nightstand whistles softly, pouring warm berry milk that warms your toes.",
      "A friendly baby cloud curled up at your feet, purring softly like a kitten until you fell fast asleep."
    ],
    ingredients: [
      "3 pinches of cinnamon moon-dust",
      "1 extra-fluffy cloud pillow",
      "2 purring starlight kittens",
      "A mug of warm berry milk"
    ],
    melody: [523.25, 659.25, 783.99, 880.00, 783.99, 659.25, 523.25],
    whisper: "Pip says: 'I fluffed your pillow twice. Have the sweetest dreams!' 💤"
  },
  starry: {
    titles: [
      "The Constellation Merry-Go-Round",
      "Lantern Walk Across the Milky Way",
      "The Pocketful of Shooting Stars"
    ],
    stories: [
      "Pip took your hand and stepped onto a bridge made of shooting stars, where each star chimes as you walk.",
      "The moon tipped its smiling crescent hat, showering the night with glowing gold glitter that lights your way.",
      "You and Pip floated in zero-gravity between friendly twinkling constellations playing hide-and-seek."
    ],
    ingredients: [
      "4 drops of liquid starlight",
      "1 silver pocket compass",
      "A basket of gentle celestial whispers",
      "A crescent moon nightlight"
    ],
    melody: [659.25, 783.99, 880.00, 987.77, 1046.50, 880.00, 783.99],
    whisper: "Pip says: 'Look up! That brightest star is winking just at you.' ✨"
  },
  flying: {
    titles: [
      "Voyage Above the Sleepy Rooftops",
      "The Floating Cloud Hammock",
      "Riding the Midnight Wind Chime"
    ],
    stories: [
      "Pip scooped you onto a soft white cloud, gliding effortlessly over chimneys and quiet sleeping gardens.",
      "A gentle night breeze caught Pip's starry nightcap, steering your cloud gently across the lavender sky.",
      "You soared above the Midnight Nursery, watching all the little ghost babies nodding off below."
    ],
    ingredients: [
      "1 cloud glider with velvet wings",
      "A jar of zero-gravity dream syrup",
      "3 soothing gusts of midnight breeze",
      "A lantern with an amber flame"
    ],
    melody: [587.33, 659.25, 880.00, 783.99, 659.25, 587.33, 523.25],
    whisper: "Pip says: 'Hold on to Pip's nightcap bow, we're floating through the clouds!' ☁️"
  },
  adventurous: {
    titles: [
      "The Secret Toy Tower of Midnight",
      "The Moonlit Carousel of Baby Dragons",
      "The Enchanted Clockwork Music Box"
    ],
    stories: [
      "Pip unlocked the secret toy attic where plush dragons snooze on piles of soft golden coins.",
      "You and Pip discovered an ancient clockwork carousel whose wooden horses dance to gentle music box chimes.",
      "A friendly night owl gave Pip a key to the Dream Library, where books read themselves aloud in gentle whispers."
    ],
    ingredients: [
      "1 miniature brass winding key",
      "A plush dragon who only breathes bubbles",
      "2 enchanted storybook pages",
      "A pocketful of sweet stardust"
    ],
    melody: [523.25, 587.33, 659.25, 783.99, 880.00, 987.77, 880.00],
    whisper: "Pip says: 'Every big adventure needs a sleepy hero at the end.' 🏰"
  },
  sleepy: {
    titles: [
      "The Very, Very Long Yawn",
      "Heavy Eyelids & Lavender Mist",
      "The Midnight Nursery Lullaby"
    ],
    stories: [
      "Pip gave a huge, squeaky baby yawn that was so contagious the entire night sky closed its eyes with you.",
      "A quiet blanket of lavender mist rolled over your bed, making every thought soft and heavy.",
      "The gentle hum of Pip's music box filled the room with waves of warm, peaceful slumber."
    ],
    ingredients: [
      "5 drops of lavender dream oil",
      "1 gigantic contagion yawn",
      "A pair of velvet night socks",
      "A bedtime kiss on the forehead"
    ],
    melody: [440.00, 523.25, 659.25, 587.33, 523.25, 440.00, 392.00],
    whisper: "Pip whispers: 'Shh... close your eyes now. Pip will guard your sleep.' 💤"
  }
};

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = req.method === 'POST' ? req.body : req.query;
  const moodInput = (query && query.mood ? String(query.mood).toLowerCase().trim() : 'cozy');
  const userThought = (query && query.thought ? String(query.thought).trim() : '');

  // Match mood key or default to cozy
  const keys = Object.keys(dreamTemplates);
  let matchedKey = keys.find(k => moodInput.includes(k)) || 'cozy';

  const template = dreamTemplates[matchedKey];
  const randIndex = Math.floor(Math.random() * template.titles.length);

  const dreamRecipe = {
    mood: matchedKey,
    title: template.titles[randIndex],
    story: userThought 
      ? `You whispered: "${userThought}". ${template.stories[randIndex]}`
      : template.stories[randIndex],
    ingredients: template.ingredients,
    melody: template.melody,
    whisper: template.whisper,
    craftedAt: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' IST',
    engineer: "Pip · Junior Dream Engineer"
  };

  return res.status(200).json({
    success: true,
    dream: dreamRecipe
  });
}
