import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getModels = async () => {
  const response = await api.get('/models');
  return response.data.models;
};

export const getChats = async () => {
  const response = await api.get('/chats');
  return response.data.chats;
};

export const createChat = async (model) => {
  const response = await api.post('/chats', { model });
  return response.data;
};

export const sendMessage = async (chatId, message) => {
  const response = await api.post(`/chats/${chatId}/messages`, message);
  return response.data;
};

export const updateChat = async (chatId, chat) => {
  const response = await api.put(`/chats/${chatId}`, chat);
  return response.data;
};

export const deleteChat = async (chatId) => {
  const response = await api.delete(`/chats/${chatId}`);
  return response.data;
}; 