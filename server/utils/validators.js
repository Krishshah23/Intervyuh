import { ApiError } from './ApiError.js';
import { ROUND_OPTIONS, RESULT_OPTIONS } from '../models/Interview.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegisterInput({ name, email, password, confirmPassword }) {
  if (!name || !name.trim()) throw new ApiError(400, 'Please enter your name.');
  if (!email || !EMAIL_RE.test(email)) throw new ApiError(400, 'Please enter a valid email address.');
  if (!password || password.length < 6) throw new ApiError(400, 'Password must be at least 6 characters.');
  if (confirmPassword !== undefined && password !== confirmPassword) {
    throw new ApiError(400, 'Passwords do not match.');
  }
}

export function validateLoginInput({ email, password }) {
  if (!email || !EMAIL_RE.test(email)) throw new ApiError(400, 'Please enter a valid email address.');
  if (!password) throw new ApiError(400, 'Please enter your password.');
}

export function validateInterviewInput(body, { partial = false } = {}) {
  const required = ['company', 'role', 'date', 'round', 'result', 'rating'];

  if (!partial) {
    for (const field of required) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        throw new ApiError(400, fieldMessage(field));
      }
    }
  }

  if (body.company !== undefined && !body.company.trim()) {
    throw new ApiError(400, 'Please enter the company name.');
  }
  if (body.role !== undefined && !body.role.trim()) {
    throw new ApiError(400, 'Please enter the role.');
  }
  if (body.date !== undefined && isNaN(new Date(body.date).getTime())) {
    throw new ApiError(400, 'Please enter a valid date.');
  }
  if (body.round !== undefined && !ROUND_OPTIONS.includes(body.round)) {
    throw new ApiError(400, 'Please select a valid round.');
  }
  if (body.result !== undefined && !RESULT_OPTIONS.includes(body.result)) {
    throw new ApiError(400, 'Please select a valid result.');
  }
  if (body.rating !== undefined) {
    const rating = Number(body.rating);
    if (isNaN(rating) || rating < 1 || rating > 10) {
      throw new ApiError(400, 'Rating must be between 1 and 10.');
    }
  }

  const textFields = ['wentWell', 'wentWrong', 'questionsICouldntAnswer', 'keyLearning', 'whatToImprove', 'topicsToPrepare', 'additionalNotes'];
  for (const field of textFields) {
    if (typeof body[field] === 'string' && body[field].length > 3000) {
      throw new ApiError(400, 'That field is too long. Please shorten it.');
    }
  }
}

function fieldMessage(field) {
  const messages = {
    company: 'Please enter the company name.',
    role: 'Please enter the role.',
    date: 'Please select a date.',
    round: 'Please select the interview round.',
    result: 'Please select the interview result.',
    rating: 'Please give an overall rating.',
  };
  return messages[field] || `Please provide ${field}.`;
}
