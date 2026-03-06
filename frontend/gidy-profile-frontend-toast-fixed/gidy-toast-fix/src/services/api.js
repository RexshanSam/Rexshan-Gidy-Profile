import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.response.use(
  res => res,
  err => {
    console.error('[API Error]', err.response?.status, err.config?.url, err.message)
    return Promise.reject(err)
  }
)

// ── Profile ───────────────────────────────────────────────────────────────────
export const profileApi = {
  getAll:  ()         => api.get('/profiles').then(r => r.data),
  get:     (id)       => api.get(`/profiles/${id}`).then(r => r.data),
  create:  (data)     => api.post('/profiles', data).then(r => r.data),
  update:  (id, data) => api.put(`/profiles/${id}`, data).then(r => r.data),
  delete:  (id)       => api.delete(`/profiles/${id}`).then(r => r.data),

  uploadPhoto: (id, file) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post(`/profiles/${id}/photo`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data)
  },

  uploadResume: (id, file) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post(`/profiles/${id}/resume`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data)
  },
}

// ── Skills ────────────────────────────────────────────────────────────────────
export const skillsApi = {
  list:    (profileId)           => api.get(`/profiles/${profileId}/skills`).then(r => r.data),
  add:     (profileId, skill)    => api.post(`/profiles/${profileId}/skills`, skill).then(r => r.data),
  delete:  (profileId, skillId)  => api.delete(`/profiles/${profileId}/skills/${skillId}`).then(r => r.data),
  endorse: (profileId, skillId)  => api.post(`/profiles/${profileId}/skills/${skillId}/endorse`).then(r => r.data),
}

// ── Experience ────────────────────────────────────────────────────────────────
export const experienceApi = {
  list:   (profileId)           => api.get(`/profiles/${profileId}/experiences`).then(r => r.data),
  add:    (profileId, exp)      => api.post(`/profiles/${profileId}/experiences`, exp).then(r => r.data),
  update: (profileId, id, exp)  => api.put(`/profiles/${profileId}/experiences/${id}`, exp).then(r => r.data),
  delete: (profileId, id)       => api.delete(`/profiles/${profileId}/experiences/${id}`).then(r => r.data),
}

// ── Education ─────────────────────────────────────────────────────────────────
export const educationApi = {
  list:   (profileId)           => api.get(`/profiles/${profileId}/educations`).then(r => r.data),
  add:    (profileId, edu)      => api.post(`/profiles/${profileId}/educations`, edu).then(r => r.data),
  update: (profileId, id, edu)  => api.put(`/profiles/${profileId}/educations/${id}`, edu).then(r => r.data),
  delete: (profileId, id)       => api.delete(`/profiles/${profileId}/educations/${id}`).then(r => r.data),
}

// ── AI Bio ────────────────────────────────────────────────────────────────────
export const aiBioApi = {
  generate: (profileId) => api.post(`/profiles/${profileId}/ai-bio`).then(r => r.data),
}

export default api
