import axios from 'axios';
import type { PortfolioApp } from '../types';

const API_URL = '/api';

export const getApps = async () => {
  const response = await axios.get<PortfolioApp[]>(`${API_URL}/apps`);
  return response.data;
};

export const getApp = async (id: number) => {
  const response = await axios.get<PortfolioApp>(`${API_URL}/apps/${id}`);
  return response.data;
};

export const createApp = async (app: Partial<PortfolioApp>) => {
  const response = await axios.post<PortfolioApp>(`${API_URL}/apps`, app);
  return response.data;
};

export const updateApp = async (id: number, app: Partial<PortfolioApp>) => {
  const response = await axios.put<PortfolioApp>(`${API_URL}/apps/${id}`, app);
  return response.data;
};

export const deleteApp = async (id: number) => {
  await axios.delete(`${API_URL}/apps/${id}`);
};

