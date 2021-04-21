import { Schema, model } from 'mongoose';

const appTypes = {
  ANDROID: 'ANDROID',
  iOS: 'iOS',
};

const appSchema = new Schema({
  appId: String,
  image: String,
  name: String,
  ratingCount: Number,
  genres: [String],
  developer: String,
  ratings: Number,
  link: String,
  appType: {
    type: String,
    enum: appTypes,
    default: appTypes.iOS,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const appModel = model('App', appSchema);
appModel.types = appTypes;

export default appModel;
