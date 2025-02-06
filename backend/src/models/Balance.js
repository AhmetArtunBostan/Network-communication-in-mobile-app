const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currency: {
    type: String,
    required: true,
    uppercase: true
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index to ensure unique balance per user and currency
balanceSchema.index({ userId: 1, currency: 1 }, { unique: true });

const Balance = mongoose.model('Balance', balanceSchema);

module.exports = Balance;
