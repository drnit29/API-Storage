import axios from 'axios';
import { ApiService } from '../types';

const API_URL = 'http://localhost:3001/api';

// Função para obter todos os serviços da API
export const getServices = async (): Promise<ApiService[]> => {
  try {
    const response = await axios.get(`${API_URL}/services`);
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

// Função para adicionar um novo serviço
export const addService = async (service: ApiService): Promise<ApiService | null> => {
  try {
    const response = await axios.post(`${API_URL}/services`, service);
    return response.data;
  } catch (error) {
    console.error('Error adding service:', error);
    return null;
  }
};

// Função para atualizar um serviço existente
export const updateService = async (updatedService: ApiService): Promise<ApiService | null> => {
  try {
    const response = await axios.put(`${API_URL}/services/${updatedService.id}`, updatedService);
    return response.data;
  } catch (error) {
    console.error('Error updating service:', error);
    return null;
  }
};

// Função para excluir um serviço
export const deleteService = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/services/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting service:', error);
    return false;
  }
};
