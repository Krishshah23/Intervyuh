import Interview from '../models/Interview.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  buildPerformanceTrend,
  buildRecurringWeaknesses,
  buildQuickInsight,
  buildImprovementFocus,
  buildPreviousLearnings,
  average,
} from '../services/insightsService.js';

export const getInsights = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ userId: req.user._id }).sort({ date: 1 });

  const allRatings = interviews.map((i) => i.rating);
  const last5 = interviews.slice(-5).map((i) => i.rating);

  res.json({
    success: true,
    data: {
      totalInterviews: interviews.length,
      trend: buildPerformanceTrend(interviews),
      averageOverall: average(allRatings),
      averageRecent5: average(last5),
      recurringWeaknesses: buildRecurringWeaknesses(interviews),
      quickInsight: buildQuickInsight(interviews),
      improvementFocus: buildImprovementFocus(interviews),
      previousLearnings: buildPreviousLearnings(interviews),
    },
  });
});
