import { create } from 'zustand';
import axios from 'axios';
import { API_URL } from '../config';

interface Rate {
  currency: string;
  code: string;
  mid: number;
  effectiveDate?: string;
}

interface ArchivedRate {
  currency: string;
  rate: number;
  effectiveDate: string;
}

interface RatesStore {
  currentRates: Rate[];
  historicalRates: Rate[];
  archivedRates: ArchivedRate[];
  loading: boolean;
  error: string | null;
  fetchCurrentRates: () => Promise<void>;
  fetchHistoricalRates: (currency: string, startDate: string, endDate: string) => Promise<void>;
  fetchArchivedRates: (currency?: string, startDate?: string, endDate?: string) => Promise<void>;
  archiveCurrentRates: () => Promise<void>;
}

export const useRatesStore = create<RatesStore>((set) => ({
  currentRates: [],
  historicalRates: [],
  archivedRates: [],
  loading: false,
  error: null,

  fetchCurrentRates: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/api/rates/current`);
      set({ currentRates: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch current rates', loading: false });
    }
  },

  fetchHistoricalRates: async (currency: string, startDate: string, endDate: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/api/rates/historical/${currency}`,
        {
          params: { startDate, endDate }
        }
      );
      set({ historicalRates: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch historical rates', loading: false });
    }
  },

  fetchArchivedRates: async (currency?: string, startDate?: string, endDate?: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/api/rates/archived`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          params: {
            currency,
            startDate,
            endDate
          }
        }
      );
      set({ archivedRates: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch archived rates', loading: false });
    }
  },

  archiveCurrentRates: async () => {
    set({ loading: true, error: null });
    try {
      await axios.post(
        `${API_URL}/api/rates/archive`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      set({ loading: false });
    } catch (error) {
      set({ error: 'Failed to archive rates', loading: false });
    }
  },
}));
