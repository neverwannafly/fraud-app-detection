import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  username: String,
  email: String,
  name: String,
});

export default model('User', userSchema);
