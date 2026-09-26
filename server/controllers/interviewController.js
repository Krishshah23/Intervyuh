import Interview from '../models/Interview.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateInterviewInput } from '../utils/validators.js';

const TEXT_FIELDS = ['wentWell', 'wentWrong', 'questionsICouldntAnswer', 'keyLearning', 'whatToImprove', 'topicsToPrepare', 'additionalNotes'];

function pickInterviewFields(body) {
  const fields = ['company', 'role', 'date', 'round', 'result', 'rating', ...TEXT_FIELDS];
  const data = {};
  for (const field of fields) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  if (data.company) data.company = data.company.trim();
  if (data.role) data.role = data.role.trim();
  if (data.rating !== undefined) data.rating = Number(data.rating);
  return data;
}

export const listInterviews = asyncHandler(async (req, res) => {
  const { search, result, round, sort } = req.query;
  const query = { userId: req.user._id };

  if (result) query.result = result;
  if (round) query.round = round;
  if (search) {
    const regex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [{ company: regex }, { role: regex }];
  }

  let sortSpec = { date: -1 };
  if (sort === 'oldest') sortSpec = { date: 1 };
  else if (sort === 'highest') sortSpec = { rating: -1 };
  else if (sort === 'lowest') sortSpec = { rating: 1 };

  const interviews = await Interview.find(query).sort(sortSpec);
  res.json({ success: true, data: { interviews } });
});

export const getInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
  if (!interview) throw new ApiError(404, 'Interview not found.');
  res.json({ success: true, data: { interview } });
});

export const createInterview = asyncHandler(async (req, res) => {
  validateInterviewInput(req.body);
  const data = pickInterviewFields(req.body);
  const interview = await Interview.create({ ...data, userId: req.user._id });
  res.status(201).json({ success: true, data: { interview } });
});

export const updateInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
  if (!interview) throw new ApiError(404, 'Interview not found.');

  validateInterviewInput(req.body, { partial: true });
  const data = pickInterviewFields(req.body);
  Object.assign(interview, data);
  await interview.save();

  res.json({ success: true, data: { interview } });
});

export const deleteInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!interview) throw new ApiError(404, 'Interview not found.');
  res.json({ success: true, data: { id: req.params.id } });
});
