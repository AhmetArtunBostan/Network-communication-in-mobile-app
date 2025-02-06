const axios = require('axios');

const NBP_API_URL = 'http://api.nbp.pl/api';

const getCurrentRates = async () => {
  try {
    console.log('Fetching current rates from NBP API');
    const response = await axios.get(`${NBP_API_URL}/exchangerates/tables/A?format=json`);
    const rates = {};
    
    // Convert array of rates to object for easier access
    response.data[0].rates.forEach(rate => {
      rates[rate.code] = rate.mid;
    });
    
    console.log('Current rates:', rates);
    return rates;
  } catch (error) {
    console.error('Error fetching rates from NBP API:', error);
    // Return default rates in case of API failure
    return {
      USD: 4.0,
      EUR: 4.3,
      GBP: 5.0
    };
  }
};

const getRate = async (currency) => {
  if (currency === 'PLN') return 1;
  
  try {
    const rates = await getCurrentRates();
    return rates[currency];
  } catch (error) {
    console.error(`Error getting rate for ${currency}:`, error);
    throw error;
  }
};

module.exports = {
  getCurrentRates,
  getRate
};
