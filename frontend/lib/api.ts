import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(config.headers)
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new CustomEvent('auth:logout'));
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);


export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/api/auth/register', data),
  verify: (token: string) =>
    api.get(`/api/auth/verify/${token}`),
  forgotPassword: (data: { email: string }) =>
    api.post('/api/auth/forgot-password', data),
};


export const accountAPI = {
  getProfile: () => api.get('/api/account/'),
  updateProfile: (data: Partial<{
    username: string;
    nickname: string;
    about: string;
    avatar: string;
    banner: string;
    email: string;
  }>) => api.patch('/api/account/edit', data),
  resetPassword: (data: { oldPassword: string; newPassword: string }) =>
    api.post('/api/account/reset-password', data),
  changeEmail: (data: { newEmail: string; password: string }) =>
    api.patch('/api/account/email-change', data),
};


export const channelsAPI = {
  getAll: () => api.get('/api/channels/'),
  getAllAndDms: () => api.get('/api/channels/all'),
  getById: (id: string) => api.get(`/api/channels/${id}`),
  create: (data: { name: string }) => api.post('/api/channels/create', data),
  edit: (id: string, data: { name: string }) => api.patch(`/api/channels/${id}`, data),
  delete: (id: string) => api.delete(`/api/channels/${id}`),
  sendMessage: (id: string, data: { content: string }) =>
    api.post(`/api/channels/${id}/messages`, data),
  editMessage: (channelId: string, messageId: string, data: { content: string }) =>
    api.patch(`/api/channels/${channelId}/messages/${messageId}`, data),
  deleteMessage: (channelId: string, messageId: string) =>
    api.delete(`/api/channels/${channelId}/messages/${messageId}`),
};


export const dmsAPI = {
  getUserDms: () => api.get('/api/dms/'),
  create: (data: { username: string }) => api.post('/api/dms/create', data),
  getById: (id: string) => api.get(`/api/dms/${id}`),
  sendMessage: (id: string, data: { content: string }) =>
    api.post(`/api/dms/${id}/messages`, data),
  editMessage: (dmId: string, messageId: string, data: { content: string }) =>
    api.patch(`/api/dms/${dmId}/messages/${messageId}`, data),
  deleteMessage: (dmId: string, messageId: string) =>
    api.delete(`/api/dms/${dmId}/messages/${messageId}`),
};


export const usersAPI = {
  getProfile: (id: string) => api.get(`/api/users/${id}`),
};


export const invitesAPI = {
  getChannelInvites: (channelId: string) => api.get(`/api/invites/channel/${channelId}`),
  getInvite: (id: string) => api.get(`/api/invites/${id}`),
  accept: (id: string) => api.post(`/api/invites/${id}/accept`),
  create: (channelId: string) => api.post(`/api/invites/channels/${channelId}/invites`),
  delete: (id: string) => api.delete(`/api/invites/${id}`),
};


export const cdnAPI = {
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return axios.post(`${API_BASE_URL}/cdn/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
  uploadBanner: (file: File) => {
    const formData = new FormData();
    formData.append('banner', file);
    return axios.post(`${API_BASE_URL}/cdn/banner`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
};