import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add request interceptor for handling errors
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error Data:', error.response.data);
      console.error('Error Status:', error.response.status);
      console.error('Error Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export const getModels = async () => {
  try {
    const response = await api.get('/models');
    return response.data.models;
  } catch (error) {
    console.error('Failed to fetch models:', error);
    throw error;
  }
};

export const getChats = async () => {
  try {
    const response = await api.get('/chats');
    return response.data.chats;
  } catch (error) {
    console.error('Failed to fetch chats:', error);
    throw error;
  }
};

export const createChat = async (model) => {
  try {
    console.log('Creating chat with model:', model);
    const response = await api.post('/chats', { model });
    console.log('Create chat response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to create chat:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    throw error;
  }
};

export const sendMessage = async (chatId, message) => {
  try {
    const response = await api.post(`/chats/${chatId}/messages`, message);
    return response.data;
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
};

export const updateChat = async (chatId, chat) => {
  try {
    const response = await api.put(`/chats/${chatId}`, chat);
    return response.data;
  } catch (error) {
    console.error('Failed to update chat:', error);
    throw error;
  }
};

export const deleteChat = async (chatId) => {
  try {
    const response = await api.delete(`/chats/${chatId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete chat:', error);
    throw error;
  }
}; 