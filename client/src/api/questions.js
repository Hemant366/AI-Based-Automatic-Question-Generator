import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export const generateQuestions = async (params) => {
  const response = await axios.post(`${API_BASE}/generate`, params);
  return response.data;
};

export const fetchHistory = async () => {
  const response = await axios.get(`${API_BASE}/history`);
  return response.data;
};

export const fetchHistorySession = async (id) => {
  const response = await axios.get(`${API_BASE}/history/${id}`);
  return response.data;
};

export const deleteHistorySession = async (id) => {
  const response = await axios.delete(`${API_BASE}/history/${id}`);
  return response.data;
};
