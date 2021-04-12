import searchItunes from 'searchitunes';
import jobManager from '../jobManager';

import { App, Analysis } from '../models';

async function requestAnalysis(req, res) {
  const parseRegex = /id[0-9]+/;
  const { url } = req.body;
  const appId = url
    .match(parseRegex)[0]
    .slice(2);

  const appObject = await App.findOne({ appId });
  if (!appObject) {
    try {
      const app = await searchItunes({ id: appId });
      await App.create({
        appId,
        image: app.artworkUrl512,
        ratingCount: app.userRatingCount,
        genres: app.genres,
        developer: app.artistName,
        name: app.trackName,
        ratings: app.averageUserRating,
        link: app.trackViewUrl,
      });
      await Analysis.create({ appId });

      jobManager.enqueueJob(appId);
      res.send({ appId, success: true });
    } catch (err) {
      res.send({ success: false });
    }
  } else {
    const analysis = await Analysis.findOne({ appId });
    const { isFinished } = analysis;
    if (isFinished) {
      res.send({ appId, success: true, analysisReady: true });
    } else {
      res.send({ appId, success: true });
    }
  }
}

export default [
  '/request-analysis',
  requestAnalysis,
];
