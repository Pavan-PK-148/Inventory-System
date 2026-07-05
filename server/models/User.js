import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a username identity.'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address.'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email format.',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a secure authorization password.'],
      minlength: 6,
    },
    // Feature 1: Role-Based Access Control Core Support
    role: {
      type: String,
      enum: ['admin', 'manager', 'viewer'],
      default: 'admin', // Kept as admin for simple local development cluster management
    },
  },
  { timestamps: true }
);

// Modernized async hook: No 'next' callback parameter is needed when returning an async block
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Structural helper to evaluate password validity
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;