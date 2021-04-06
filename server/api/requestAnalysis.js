import searchItunes from 'searchitunes';
import jobManager from '../jobManager';

import { App } from '../models';

async function requestAnalysis(req, res) {
  const parseRegex = /id[0-9]+/;
  const { url } = req.body;
  const appId = url
    .match(parseRegex)[0]
    .slice(2);

  const appObject = await App.findOne({ appId });
  if (!appObject) {
    searchItunes({ id: appId })
      .then((app) => {
        App.create({
          appId,
          image: app.artworkUrl512,
          ratingCount: app.userRatingCount,
          genres: app.genres,
          developer: app.artistName,
          name: app.trackName,
          ratings: app.averageUserRating,
          link: app.trackViewUrl,
        }, (cerr) => {
          if (cerr) return;
          jobManager.enqueueJob(appId);
          res.send({ appId, success: true });
        });
      })
      .catch(() => res.send({ success: false }));
  } else {
    res.send({ appId, success: true, analysisReady: true });
  }
}

export default [
  '/request-ananlysis',
  requestAnalysis,
];
