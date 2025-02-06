const express = require('express');
const router = express.Router();
const nbpService = require('../services/nbpService');
const ArchivedRate = require('../models/ArchivedRate');
const auth = require('../middleware/auth');

// Get current rates
router.get('/current', async (req, res) => {
  try {
    const rates = await nbpService.getCurrentRates();
    res.json(rates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching current rates' });
  }
});

// Get historical rates for a specific currency
router.get('/historical/:currency', async (req, res) => {
  try {
    const { currency } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const rates = await nbpService.getHistoricalRates(startDate, endDate, currency);
    res.json(rates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching historical rates' });
  }
});

// Archive current rates
router.post('/archive', auth, async (req, res) => {
  try {
    const currentRates = await nbpService.getCurrentRates();
    const today = new Date();

    const archivedRates = await Promise.all(
      currentRates.map(async (rate) => {
        const archivedRate = new ArchivedRate({
          currency: rate.code,
          rate: rate.mid,
          effectiveDate: today
        });
        return archivedRate.save();
      })
    );

    res.json(archivedRates);
  } catch (error) {
    res.status(500).json({ message: 'Error archiving rates' });
  }
});

// Get archived rates
router.get('/archived', auth, async (req, res) => {
  try {
    const { currency, startDate, endDate } = req.query;
    let query = {};

    if (currency) {
      query.currency = currency.toUpperCase();
    }

    if (startDate && endDate) {
      query.effectiveDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const archivedRates = await ArchivedRate.find(query)
      .sort({ effectiveDate: -1 })
      .limit(100);

    res.json(archivedRates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching archived rates' });
  }
});

// Get specific rate for a currency
router.get('/:currency', async (req, res) => {
  try {
    const { currency } = req.params;
    const rate = await nbpService.getRate(currency);
    res.json({ rate });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rate' });
  }
});

module.exports = router;
