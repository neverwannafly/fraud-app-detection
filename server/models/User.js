import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  username: String,
  email: String,
  name: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export default model('User', userSchema);
