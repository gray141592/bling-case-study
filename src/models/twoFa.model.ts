import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const twoFaSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
  },
  validUntil: {
    type: Date,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
});

twoFaSchema.pre('save', async function (next) {
  const twoFa = this;

  // Only hash the password if it has been modified (or is new)
  if (!twoFa.isModified('code')) {
    return next();
  }

  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(twoFa.code, salt);

    // Replace the plaintext password with the hash
    twoFa.code = hash;

    next();
  } catch (err) {
    next(err);
  }
});

export const TwoFa = mongoose.model('TwoFa', twoFaSchema);
export type TwoFa = typeof TwoFa;
