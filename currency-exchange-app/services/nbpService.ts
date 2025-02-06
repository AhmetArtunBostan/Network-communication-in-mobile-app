import axios from 'axios';

const BASE_URL = 'http://api.nbp.pl/api/';

export const nbpService = {
  getCurrentRates: async () => {
    try {
      const response = await axios.get(`${BASE_URL}exchangerates/tables/A/`);
      return response.data[0].rates;
    } catch (error) {
      console.error('Error fetching current rates:', error);
      throw error;
    }
  },

  getHistoricalRates: async (date: string) => {
    try {
      const response = await axios.get(`${BASE_URL}exchangerates/tables/A/${date}/`);
      return response.data[0].rates;
    } catch (error) {
      console.error('Error fetching historical rates:', error);
      throw error;
    }
  },

  getCurrencyRate: async (currency: string) => {
    try {
      const response = await axios.get(`${BASE_URL}exchangerates/rates/A/${currency}/`);
      return response.data.rates[0].mid;
    } catch (error) {
      console.error(`Error fetching rate for ${currency}:`, error);
      throw error;
    }
  }
};
