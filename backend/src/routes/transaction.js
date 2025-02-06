const express = require('express');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const router = express.Router();

// Get user transactions
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create exchange transaction
router.post('/exchange', auth, async (req, res) => {
  try {
    const { fromCurrency, toCurrency, fromAmount, rate } = req.body;
    const toAmount = fromAmount * rate;

    // Check if user has sufficient balance
    if (req.user.balances[fromCurrency] < fromAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Create transaction
    const transaction = new Transaction({
      user: req.user._id,
      type: 'EXCHANGE',
      fromCurrency,
      toCurrency,
      fromAmount,
      toAmount,
      rate
    });

    // Update user balances
    req.user.balances[fromCurrency] -= fromAmount;
    req.user.balances[toCurrency] += toAmount;

    await Promise.all([
      transaction.save(),
      req.user.save()
    ]);

    res.status(201).json({
      transaction,
      balances: req.user.balances
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Fund account
router.post('/fund', auth, async (req, res) => {
  try {
    const { currency, amount } = req.body;

    const transaction = new Transaction({
      user: req.user._id,
      type: 'DEPOSIT',
      fromCurrency: currency,
      fromAmount: amount
    });

    req.user.balances[currency] += amount;

    await Promise.all([
      transaction.save(),
      req.user.save()
    ]);

    res.status(201).json({
      transaction,
      balances: req.user.balances
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
