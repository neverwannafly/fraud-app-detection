import { Schema, model } from 'mongoose';

const userAnalysisSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, ref: 'User',
  },
  analysisId: {
    type: Schema.Types.ObjectId, ref: 'Analysis',
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export default model('UserAnalysis', userAnalysisSchema);
