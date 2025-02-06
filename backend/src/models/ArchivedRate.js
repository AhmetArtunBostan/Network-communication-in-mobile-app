const mongoose = require('mongoose');

const archivedRateSchema = new mongoose.Schema({
  currency: {
    type: String,
    required: true,
    uppercase: true
  },
  rate: {
    type: Number,
    required: true
  },
  effectiveDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Compound index for currency and date for faster queries
archivedRateSchema.index({ currency: 1, effectiveDate: -1 });

const ArchivedRate = mongoose.model('ArchivedRate', archivedRateSchema);

module.exports = ArchivedRate;
