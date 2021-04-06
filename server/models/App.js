import { Schema, model } from 'mongoose';

const appSchema = new Schema({
  appId: String,
  image: String,
  name: String,
  ratingCount: Number,
  genres: [String],
  developer: String,
  ratings: Number,
  link: String,
});

export default model('App', appSchema);
