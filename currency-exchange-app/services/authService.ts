import axios from 'axios';
import { API_URL } from '../config';

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    balances: {
      [key: string]: number;
    };
  };
}

export const register = async (data: RegisterData): Promise<void> => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    if (response.data.error) {
      throw new Error(response.data.error);
    }
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
};
