import { Schema } from 'mongoose';

const appReviewSchema = new Schema({
  applicationId: String,
  applicationName: String,
});

export default appReviewSchema;
