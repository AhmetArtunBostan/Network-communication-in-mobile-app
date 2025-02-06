import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../config';

interface Transaction {
  _id: string;
  type: 'BUY' | 'SELL';
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

interface TransactionHistory {
  transactions: Transaction[];
  currentPage: number;
  totalPages: number;
  totalTransactions: number;
}

interface TransactionStore {
  transactions: Transaction[];
  history: TransactionHistory | null;
  loading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  fetchHistory: (page?: number, limit?: number) => Promise<void>;
  exchangeCurrency: (fromCurrency: string, toCurrency: string, amount: number) => Promise<void>;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  history: null,
  loading: false,
  error: null,

  fetchTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/transactions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      set({ transactions: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch transactions', loading: false });
    }
  },

  fetchHistory: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/transactions/history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params: { page, limit }
      });
      set({ history: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch transaction history', loading: false });
    }
  },

  exchangeCurrency: async (fromCurrency: string, toCurrency: string, fromAmount: number) => {
    set({ loading: true, error: null });
    try {
      await axios.post(
        `${API_URL}/api/transactions/exchange`,
        {
          fromCurrency,
          toCurrency,
          fromAmount
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Refresh transactions after exchange
      await get().fetchTransactions();
      set({ loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to exchange currency',
        loading: false
      });
      throw error;
    }
  },
}));
