import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface Transaction {
  _id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'EXCHANGE';
  fromCurrency: string;
  toCurrency?: string;
  fromAmount: number;
  toAmount?: number;
  rate?: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

export interface ExchangeData {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  rate: number;
}

export interface FundData {
  currency: string;
  amount: number;
}

export const transactionService = {
  getTransactions: async (token: string): Promise<Transaction[]> => {
    try {
      const response = await axios.get(`${API_URL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  exchange: async (data: ExchangeData, token: string) => {
    try {
      const response = await axios.post(`${API_URL}/transactions/exchange`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  fund: async (data: FundData, token: string) => {
    try {
      const response = await axios.post(`${API_URL}/transactions/fund`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
