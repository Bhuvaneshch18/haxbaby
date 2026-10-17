// api/reactions.js — Live Global Nursery Reactions & Cloud Hugs API

// In-memory counter for serverless lifecycle
let globalReactions = {
  hugs: 142,
  tickles: 89,
  hearts: 215
};

const pipReactions = {
  hug: [
    "Pip wraps you in a fluffy marshmallow star-blanket! ☁️",
    "Pip hugs you back with tiny warm hands! You feel sleepy and safe.",
    "A soft puff of cloud dust billows as Pip snuggles close! 🧸"
  ],
  tickle: [
    "Pip bursts into squeaky baby giggles and kicks his tiny feet! 🌟",
    "Pip's nightcap bow jingles with delighted baby laughter!",
    "Pip tries not to laugh, snorts cute stardust, and giggles! ✨"
  ],
  heart: [
    "Pip blushes warm berry pink and his amber eyes glow bright! 💖",
    "Pip sends a floating constellation heart directly to your pillow!",
    "Pip catches your heart and presses it gently to his nightcap! 🌙"
  ]
};

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = req.method === 'POST' ? req.body : req.query;
  const type = (query && query.type ? String(query.type).toLowerCase().trim() : 'heart');

  if (type === 'hug') globalReactions.hugs += 1;
  else if (type === 'tickle') globalReactions.tickles += 1;
  else globalReactions.hearts += 1;

  const reactionPool = pipReactions[type] || pipReactions.heart;
  const message = reactionPool[Math.floor(Math.random() * reactionPool.length)];

  return res.status(200).json({
    success: true,
    type,
    message,
    totalLove: globalReactions.hugs + globalReactions.tickles + globalReactions.hearts,
    counts: globalReactions
  });
}
