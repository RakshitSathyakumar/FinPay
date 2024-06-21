const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const bankSchema = new mongoose.Schema({
  accountId: {
    type: String,
    required: true
  },
  bankId: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    required: true
  },
  fundingSourceUrl: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shareableId: {
    type: String,
    required: true
  }
});


const modelName = 'Banks';

const FinPayBank = mongoose.models[modelName] || mongoose.model(modelName, bankSchema);
export default FinPayBank;