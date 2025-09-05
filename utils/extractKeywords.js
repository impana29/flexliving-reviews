// Very small keyword extractor (stopwords minimal). Good enough for quick insights.
const STOP = new Set(['the','and','a','an','to','of','in','for','with','is','it','was','this','that','i','we','they','but','on','so','had','were','my','at']);

export default function extractKeywords(texts = []) {
  const freq = {};
  texts.forEach(t => {
    if (!t) return;
    // simple normalization
    const words = t.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(Boolean);
    words.forEach(w => {
      if (w.length < 3) return;
      if (STOP.has(w)) return;
      freq[w] = (freq[w] || 0) + 1;
    });
  });
  // sort keys by freq
  return Object.entries(freq).sort((a,b) => b[1] - a[1]).map(([k]) => k);
}
