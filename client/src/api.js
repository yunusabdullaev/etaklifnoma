import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Event Types ─────────────────────────────────────────
export const getEventTypes = () => api.get('/event-types').then(r => r.data);
export const getEventTypeById = (id) => api.get(`/event-types/${id}`).then(r => r.data);

// ── Templates ───────────────────────────────────────────
export const getTemplates = (params) => api.get('/templates', { params }).then(r => r.data);
export const getTemplateById = (id) => api.get(`/templates/${id}`).then(r => r.data);

// ── Invitations ─────────────────────────────────────────
export const createInvitation = (data) => api.post('/invitations', data).then(r => r.data);
export const getInvitationBySlug = (slug) => 
  axios.get(`/invite/${slug}`).then(r => r.data);

// ── Preview / Render ────────────────────────────────────
export const previewTemplate = (data) => api.post('/preview', data).then(r => r.data);

export default api;
