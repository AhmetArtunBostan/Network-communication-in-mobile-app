const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Balance = require('../models/Balance');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Get all balances for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const balances = await Balance.find({ userId: req.user.id });
    res.json(balances);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching balances' });
  }
});

// Add funds to a specific currency balance
router.post('/add-funds', auth, async (req, res) => {
  try {
    const { currency, amount } = req.body;

    if (!currency || !amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid currency or amount' });
    }

    let balance = await Balance.findOne({ userId: req.user.id, currency });

    if (!balance) {
      balance = new Balance({
        userId: req.user.id,
        currency,
        amount: 0
      });
    }

    const previousAmount = balance.amount;
    balance.amount += parseFloat(amount);

    // Create deposit transaction
    const transaction = new Transaction({
      userId: req.user.id,
      type: 'DEPOSIT',
      fromCurrency: currency,
      toCurrency: currency,
      fromAmount: amount,
      toAmount: amount,
      rate: 1,
      status: 'COMPLETED'
    });

    // Save both balance and transaction
    await Promise.all([
      balance.save(),
      transaction.save()
    ]);

    res.json({
      balance,
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding funds' });
  }
});

// Get balance for a specific currency
router.get('/:currency', auth, async (req, res) => {
  try {
    const balance = await Balance.findOne({
      userId: req.user.id,
      currency: req.params.currency.toUpperCase()
    });

    if (!balance) {
      return res.json({ amount: 0, currency: req.params.currency.toUpperCase() });
    }

    res.json(balance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching balance' });
  }
});

module.exports = router;
