const CATEGORY_KEYWORDS = {
  'Company Research': ['company research', 'about the company', 'know about our company', 'company-specific', 'company culture', 'company background', 'about us'],
  'Role Knowledge': ['role knowledge', 'role-specific', 'about the role', 'job description', 'responsibilities of', 'what does a', 'role fundamentals'],
  'Technical Knowledge': ['technical', 'dsa', 'data structure', 'algorithm', 'dbms', 'sql', 'react', 'python', 'coding', 'system design', 'programming'],
  Communication: ['communication', 'framing', 'articulate', 'nervous', 'confidence', 'spoken english', 'english', 'fluency'],
  'Answer Framing': ['answer framing', 'structure my answer', 'framing my answer', 'organize my thoughts'],
  'HR Questions': ['hr question', 'tell me about yourself', 'why this company', 'why this role', 'salary expectation', 'strengths and weaknesses', 'career goal'],
  'Project Explanation': ['project explanation', 'explain my project', 'project experience', 'freelance experience', 'client communication'],
  'Resume Questions': ['resume', 'cv question'],
  Confidence: ['confidence', 'nervous', 'anxious', 'under pressure'],
  Preparation: ['preparation', 'prepare', 'unprepared', 'not prepared', 'research'],
};

const CATEGORY_ORDER = Object.keys(CATEGORY_KEYWORDS);

function categorize(text) {
  const lower = text.toLowerCase();
  const matches = new Set();
  for (const category of CATEGORY_ORDER) {
    const keywords = CATEGORY_KEYWORDS[category];
    if (keywords.some((kw) => lower.includes(kw))) {
      matches.add(category);
    }
  }
  return matches;
}

export function buildRecurringWeaknesses(interviews) {
  const counts = new Map();

  for (const interview of interviews) {
    const combinedText = [
      interview.wentWrong,
      interview.questionsICouldntAnswer,
      interview.whatToImprove,
      interview.topicsToPrepare,
    ].filter(Boolean).join(' ');

    if (!combinedText.trim()) continue;

    const categories = categorize(combinedText);
    for (const category of categories) {
      counts.set(category, (counts.get(category) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildPerformanceTrend(interviews) {
  const sorted = [...interviews].sort((a, b) => new Date(a.date) - new Date(b.date));
  return sorted.map((interview, index) => ({
    index: index + 1,
    date: interview.date,
    company: interview.company,
    rating: interview.rating,
  }));
}

export function average(numbers) {
  if (numbers.length === 0) return null;
  const sum = numbers.reduce((acc, n) => acc + n, 0);
  return Math.round((sum / numbers.length) * 10) / 10;
}

export function buildQuickInsight(interviews) {
  if (interviews.length < 3) return null;

  const sorted = [...interviews].sort((a, b) => new Date(a.date) - new Date(b.date));
  const last5 = sorted.slice(-5);

  if (last5.length >= 3) {
    const firstHalf = last5.slice(0, Math.ceil(last5.length / 2));
    const secondHalf = last5.slice(Math.ceil(last5.length / 2));
    const firstAvg = average(firstHalf.map((i) => i.rating));
    const secondAvg = average(secondHalf.map((i) => i.rating));

    if (secondAvg > firstAvg + 0.5) {
      return `Your interviews have improved from an average of ${firstAvg}/10 to ${secondAvg}/10 over your last ${last5.length} interviews.`;
    }
  }

  const weaknesses = buildRecurringWeaknesses(interviews);
  if (weaknesses.length > 0 && weaknesses[0].count >= 2) {
    return `Your most common weakness is ${weaknesses[0].category.toLowerCase()}.`;
  }

  return null;
}

export function buildImprovementFocus(interviews) {
  const weaknesses = buildRecurringWeaknesses(interviews);
  if (weaknesses.length === 0) return null;

  const top = weaknesses[0];
  const recommendations = {
    'Company Research': "Before your next interview, spend 10-15 minutes understanding the company's product, customers, business model and role.",
    'Role Knowledge': 'Review the job description closely and be ready to explain the core responsibilities of the role in your own words.',
    'Technical Knowledge': 'Revise the core technical topics relevant to the role and practice explaining them out loud.',
    Communication: 'Practice structuring your answers before speaking, and rehearse key answers so they come out clearly under pressure.',
    'Answer Framing': 'Use a simple structure (situation, action, result) to frame your answers before the interview.',
    'HR Questions': 'Prepare solid answers for common HR questions like "Tell me about yourself" and "Why this company?"',
    'Project Explanation': 'Prepare a clear, concise walkthrough of your key projects and be ready to discuss your specific contributions.',
    'Resume Questions': 'Review your resume line by line and prepare to explain every point on it confidently.',
    Confidence: 'Do a mock interview beforehand to reduce nerves and build familiarity with speaking under pressure.',
    Preparation: 'Block dedicated prep time before each interview instead of preparing at the last minute.',
    Other: 'Review your past reflections before your next interview to avoid repeating the same mistake.',
  };

  return {
    category: top.category,
    count: top.count,
    message: `You've mentioned ${top.category.toLowerCase()} as a weakness in ${top.count} interview${top.count > 1 ? 's' : ''}.`,
    recommendation: recommendations[top.category] || recommendations.Other,
  };
}

export function buildPreviousLearnings(interviews, limit = 5) {
  const sorted = [...interviews].sort((a, b) => new Date(b.date) - new Date(a.date));
  const notes = [];

  for (const interview of sorted) {
    if (interview.whatToImprove?.trim()) notes.push(interview.whatToImprove.trim());
    if (interview.keyLearning?.trim()) notes.push(interview.keyLearning.trim());
    if (notes.length >= limit) break;
  }

  return notes.slice(0, limit);
}
