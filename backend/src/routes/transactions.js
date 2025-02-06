const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const nbpService = require('../services/nbpService');
const axios = require('axios');

// Get all transactions for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

// Create a new exchange transaction
router.post('/exchange', auth, async (req, res) => {
  try {
    const { fromCurrency, toCurrency, fromAmount } = req.body;
    console.log('Exchange request:', { fromCurrency, toCurrency, fromAmount });

    if (!fromCurrency || !toCurrency || !fromAmount || fromAmount <= 0) {
      return res.status(400).json({ message: 'Invalid transaction details' });
    }

    // Get user and check balance
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize balance if it doesn't exist
    if (!user.balance[fromCurrency]) {
      user.balance[fromCurrency] = 0;
    }
    if (!user.balance[toCurrency]) {
      user.balance[toCurrency] = 0;
    }

    console.log('Current balance:', user.balance);

    // Check if user has sufficient balance
    if (user.balance[fromCurrency] < fromAmount) {
      return res.status(400).json({ 
        message: `Insufficient ${fromCurrency} balance. Current balance: ${user.balance[fromCurrency]}`
      });
    }

    // Get exchange rates from NBP API
    const rates = await nbpService.getCurrentRates();
    console.log('Exchange rates:', rates);

    let fromRate = 1;
    let toRate = 1;

    // If fromCurrency is PLN, we need the inverse rate for toCurrency
    if (fromCurrency === 'PLN') {
      toRate = 1 / rates[toCurrency];
    }
    // If toCurrency is PLN, we use the direct rate for fromCurrency
    else if (toCurrency === 'PLN') {
      fromRate = rates[fromCurrency];
    }
    // If neither currency is PLN, we convert through PLN
    else {
      fromRate = rates[fromCurrency];
      toRate = 1 / rates[toCurrency];
    }

    const exchangeRate = toRate / fromRate;
    console.log('Calculated exchange rate:', exchangeRate);

    // Calculate the amount to receive
    const toAmount = fromAmount * exchangeRate;
    console.log('Amount to receive:', toAmount);

    // Create transaction
    const transaction = new Transaction({
      userId: user._id,
      type: 'EXCHANGE',
      fromCurrency,
      toCurrency,
      fromAmount,
      toAmount,
      rate: exchangeRate,
      status: 'COMPLETED'
    });

    // Update user balances
    user.balance[fromCurrency] -= fromAmount;
    user.balance[toCurrency] += toAmount;

    // Save both transaction and updated user balance
    await Promise.all([
      transaction.save(),
      user.save()
    ]);

    console.log('Transaction completed:', {
      fromAmount,
      toAmount,
      newBalance: user.balance
    });

    res.status(201).json({
      transaction,
      newBalance: user.balance
    });

  } catch (error) {
    console.error('Exchange error:', error);
    res.status(500).json({ 
      message: 'Error processing exchange',
      error: error.message 
    });
  }
});

// Get transaction history with pagination
router.get('/history', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments({ userId: req.user.userId });

    res.json({
      transactions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTransactions: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction history' });
  }
});

// Get current exchange rates
router.get('/rates', async (req, res) => {
  try {
    const response = await axios.get('http://api.nbp.pl/api/exchangerates/tables/A/');
    res.json(response.data[0].rates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exchange rates' });
  }
});

// Get historical exchange rates
router.get('/rates/historical/:date', async (req, res) => {
  try {
    const response = await axios.get(`http://api.nbp.pl/api/exchangerates/tables/A/${req.params.date}/`);
    res.json(response.data[0].rates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching historical rates' });
  }
});

// Exchange currency
router.post('/exchange-alt', auth, async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.body;
    
    // Get current user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has sufficient balance
    if (user.balance[fromCurrency] < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Get current exchange rate
    const response = await axios.get('http://api.nbp.pl/api/exchangerates/tables/A/');
    const rates = response.data[0].rates;
    
    // Find exchange rates for both currencies
    const fromRate = fromCurrency === 'PLN' ? 1 : rates.find(r => r.code === fromCurrency)?.mid;
    const toRate = toCurrency === 'PLN' ? 1 : rates.find(r => r.code === toCurrency)?.mid;
    
    if (!fromRate || !toRate) {
      return res.status(400).json({ message: 'Invalid currency' });
    }

    // Calculate exchange amount
    const plnAmount = amount * fromRate;
    const exchangedAmount = plnAmount / toRate;

    // Update balances
    user.balance[fromCurrency] -= amount;
    user.balance[toCurrency] += exchangedAmount;

    await user.save();

    res.json({
      message: 'Exchange successful',
      newBalance: user.balance
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during exchange' });
  }
});

// Add funds (virtual transfer)
router.post('/deposit', auth, async (req, res) => {
  try {
    const { currency, amount } = req.body;
    
    // Get current user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update balance
    user.balance[currency] += amount;
    await user.save();

    res.json({
      message: 'Deposit successful',
      newBalance: user.balance
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during deposit' });
  }
});

module.exports = router;
