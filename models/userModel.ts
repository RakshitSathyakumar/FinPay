import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Define the user schema
const FinPayNewUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  dwollaCustomerUrl: {
    type: String,
    required: true,
  },
  dwollaCustomerId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  address1: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  ssn: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
});

// Hash the password before saving the user document
FinPayNewUserSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

const modelName = 'FinPayHackNewUser';

const FinPayHackNewUser = mongoose.models[modelName] || mongoose.model(modelName, FinPayNewUserSchema);
export default FinPayHackNewUser;