import { Schema, model } from 'mongoose';

const reviewSchema = new Schema({
  appId: String,
  reviewId: String,
  title: String,
  author: String,
  rating: Number,
  content: String,
  voteCount: Number,
});

export default model('Review', reviewSchema);
