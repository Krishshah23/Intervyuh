import api from './api';

export async function fetchInterviews(params = {}) {
  const res = await api.get('/interviews', { params });
  return res.data.data.interviews;
}

export async function fetchInterview(id) {
  const res = await api.get(`/interviews/${id}`);
  return res.data.data.interview;
}

export async function createInterview(payload) {
  const res = await api.post('/interviews', payload);
  return res.data.data.interview;
}

export async function updateInterview(id, payload) {
  const res = await api.put(`/interviews/${id}`, payload);
  return res.data.data.interview;
}

export async function deleteInterview(id) {
  await api.delete(`/interviews/${id}`);
}

export async function fetchInsights() {
  const res = await api.get('/insights');
  return res.data.data;
}
