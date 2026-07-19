// Heuristic AI detection scoring. Returns a 0–100 "human score" (higher = more human-like).

const AI_PHRASES = [
  'it is worth noting', "it's worth noting", 'it should be noted',
  'in conclusion', 'to summarize', 'in summary', 'overall,',
  'furthermore', 'moreover', 'additionally', 'subsequently',
  'it is important to', "it's important to", 'one must consider',
  'delve into', 'dive into', 'tapestry', 'nuanced', 'multifaceted',
  'in the realm of', 'stands as a testament', 'pivotal', 'underscores',
  'as previously mentioned', 'as stated above', 'as we can see',
  'needless to say', 'it goes without saying', 'in other words',
  'at the end of the day', 'having said that', 'with that being said',
];

const HUMAN_MARKERS = [
  "i've", "i'm", "i'll", "i'd", "we've", "we're", "we'll", "we'd",
  "you've", "you're", "you'll", "you'd", "they've", "they're", "they'll",
  "don't", "doesn't", "didn't", "won't", "wouldn't", "can't", "couldn't",
  "shouldn't", "isn't", "aren't", "wasn't", "weren't",
];

const scoreText = (text) => {
  if (!text || text.length < 30) return { humanScore: 50, aiScore: 50, signals: [] };

  const lower = text.toLowerCase();
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
  const words = text.split(/\s+/).filter(Boolean);

  if (sentences.length === 0 || words.length === 0) {
    return { humanScore: 50, aiScore: 50, signals: [] };
  }

  let penalty = 0;
  const signals = [];

  // 1. AI phrase count
  const aiPhraseHits = AI_PHRASES.filter(p => lower.includes(p));
  if (aiPhraseHits.length > 0) {
    const loss = Math.min(aiPhraseHits.length * 6, 30);
    penalty += loss;
    signals.push({ label: 'AI clichés detected', impact: -loss, examples: aiPhraseHits.slice(0, 3) });
  }

  // 2. Contraction rate (human writing uses them)
  const contractionHits = HUMAN_MARKERS.filter(m => lower.includes(m));
  const contractionBoost = Math.min(contractionHits.length * 5, 20);
  penalty -= contractionBoost; // negative penalty = boost
  if (contractionBoost > 0) {
    signals.push({ label: 'Natural contractions found', impact: contractionBoost });
  }

  // 3. Sentence length uniformity (AI tends to be very uniform)
  const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
  const avg = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const variance = sentenceLengths.reduce((sum, l) => sum + Math.pow(l - avg, 2), 0) / sentenceLengths.length;
  const stdDev = Math.sqrt(variance);
  if (stdDev < 3) {
    penalty += 15;
    signals.push({ label: 'Very uniform sentence lengths', impact: -15 });
  } else if (stdDev > 6) {
    penalty -= 10;
    signals.push({ label: 'Varied sentence lengths', impact: 10 });
  }

  // 4. Average words per sentence (AI tends toward 20–30 consistently)
  if (avg >= 20 && avg <= 30 && stdDev < 5) {
    penalty += 10;
    signals.push({ label: 'Consistent medium-length sentences', impact: -10 });
  }

  // 5. Passive voice density (simple heuristic: "is/are/was/were + verb")
  const passiveMatches = (text.match(/\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi) || []).length;
  const passiveRate = passiveMatches / sentences.length;
  if (passiveRate > 0.4) {
    penalty += 10;
    signals.push({ label: 'High passive voice usage', impact: -10 });
  }

  // 6. Paragraph transitions (AI loves to start paras with transition words)
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  const transitionStarts = paragraphs.filter(p => {
    const first = p.trim().toLowerCase().split(' ')[0];
    return ['furthermore', 'additionally', 'moreover', 'however', 'therefore', 'consequently', 'nonetheless', 'nevertheless', 'thus'].includes(first);
  }).length;
  if (paragraphs.length > 1 && transitionStarts / paragraphs.length > 0.4) {
    penalty += 10;
    signals.push({ label: 'Heavy transition word use at paragraph starts', impact: -10 });
  }

  // 7. Exclamation marks / informal punctuation (human indicator)
  const exclamations = (text.match(/!/g) || []).length;
  if (exclamations > 0) {
    const boost = Math.min(exclamations * 3, 10);
    penalty -= boost;
    signals.push({ label: 'Informal punctuation', impact: boost });
  }

  // 8. First-person singular usage
  const firstPerson = (lower.match(/\b(i |i'm|i've|i'll|i'd|my |mine |myself)\b/g) || []).length;
  if (firstPerson > 2) {
    const boost = Math.min(firstPerson * 2, 15);
    penalty -= boost;
    signals.push({ label: 'First-person voice', impact: boost });
  }

  const rawHumanScore = Math.max(0, Math.min(100, 65 - penalty));
  const humanScore = Math.round(rawHumanScore);
  const aiScore = 100 - humanScore;

  return { humanScore, aiScore, signals };
};

module.exports = { scoreText };
