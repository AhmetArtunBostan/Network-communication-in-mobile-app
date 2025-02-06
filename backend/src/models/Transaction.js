const mongoose = require('mongoose');

// Define the transaction schema
const transactionSchema = new mongoose.Schema({
  // The user who made the transaction
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // The type of transaction (BUY, SELL)
  type: {
    type: String,
    enum: ['BUY', 'SELL'],
    required: true
  },
  // The currency of the transaction
  fromCurrency: {
    type: String,
    required: true,
    uppercase: true
  },
  // The currency to exchange to
  toCurrency: {
    type: String,
    required: true,
    uppercase: true
  },
  // The amount of the transaction
  fromAmount: {
    type: Number,
    required: true
  },
  // The amount to exchange to
  toAmount: {
    type: Number,
    required: true
  },
  // The exchange rate
  rate: {
    type: Number,
    required: true
  },
  // The status of the transaction (PENDING, COMPLETED, FAILED)
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  }
}, {
  timestamps: true
});

// Create the Transaction model
const Transaction = mongoose.model('Transaction', transactionSchema);

// Export the Transaction model
module.exports = Transaction;
