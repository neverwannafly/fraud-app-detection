import { Schema, model } from 'mongoose';

const analysisSchema = new Schema({
  appId: String,
  isFinished: {
    type: Boolean,
    default: false,
  },
  analysisReports: {
    type: Map,
    default: {},
  },
  lastRequested: {
    type: Date,
    default: new Date(),
  },
});

export default model('Analysis', analysisSchema);
