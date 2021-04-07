import { Schema, model } from 'mongoose';

const analysisSchema = new Schema({
  appId: String,
  isFinished: {
    type: Boolean,
    default: false,
  },
  conetnt: {
    type: Map,
    of: String,
    default: {},
  },
  lastRequested: {
    type: Date,
    default: new Date(),
  },
});

export default model('Analysis', analysisSchema);
