import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../config';

interface Balance {
  currency: string;
  amount: number;
}

interface BalanceStore {
  balances: Balance[];
  loading: boolean;
  error: string | null;
  fetchBalances: () => Promise<void>;
  addFunds: (currency: string, amount: number) => Promise<void>;
  getBalance: (currency: string) => number;
}

export const useBalanceStore = create<BalanceStore>((set, get) => ({
  balances: [],
  loading: false,
  error: null,

  fetchBalances: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/balance`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      set({ balances: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch balances', loading: false });
    }
  },

  addFunds: async (currency: string, amount: number) => {
    set({ loading: true, error: null });
    try {
      await axios.post(
        `${API_URL}/api/balance/add-funds`,
        { currency, amount },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      // Refresh balances after adding funds
      await get().fetchBalances();
    } catch (error) {
      set({ error: 'Failed to add funds', loading: false });
    }
  },

  getBalance: (currency: string) => {
    const balance = get().balances.find(b => b.currency === currency);
    return balance ? balance.amount : 0;
  }
}));
