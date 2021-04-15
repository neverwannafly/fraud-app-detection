import searchItunes from 'searchitunes';
import jobManager from '../jobManager';

import {
  App, Analysis, User, UserAnalysis,
} from '../models';
import { hasParams, decorateRoute } from '../utils';

async function captureUser(params) {
  const {
    firstName, lastName, email, username,
  } = params;
  const user = await User.findOne({ email }) || await User.create({
    name: `${firstName} ${lastName}`,
    email,
    username,
  });

  return user.id;
}

async function createAnalysis(appId, params, analysis = null) {
  try {
    if (analysis === null) {
      // eslint-disable-next-line no-param-reassign
      analysis = await Analysis.create({ appId });
    }
    const userId = await captureUser(params);
    // eslint-disable-next-line no-unused-expressions
    await UserAnalysis.findOne(
      { userId, analysisId: analysis.id },
    ) || UserAnalysis.create(
      { userId, analysisId: analysis.id },
    );
  } catch (error) {
    // Ignorable error
  }
  jobManager.enqueueJob(appId);
}

async function createApp(appId, params) {
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
  await createAnalysis(appId, params);
}

function getAppId(parans) {
  let appId;
  try {
    const { url } = parans;
    const parseRegex = /id[0-9]+/;

    appId = url
      .match(parseRegex)[0]
      .slice(2);
  } catch (err) {
    appId = null;
  }

  return appId;
}

async function requestAnalysis(req, res) {
  const params = req.body;

  if (!hasParams(params, ['url', 'firstName', 'lastName', 'email', 'username'])) {
    res.send({ success: false, error: 'Required fields empty' });
    return;
  }

  const appId = getAppId(params);
  if (appId === null) {
    res.send({ success: false, error: 'Invalid App Id' });
    return;
  }

  const appObject = await App.findOne({ appId });
  if (!appObject) {
    try {
      createApp(appId, params);
      res.send({ appId, success: true });
    } catch (err) {
      res.send({ success: false, error: err });
    }
  } else {
    const analysis = await Analysis.findOne({ appId });
    await createAnalysis(appId, params, analysis);
    const { isFinished } = analysis;
    if (isFinished) {
      res.send({ appId, success: true, analysisReady: true });
    } else {
      res.send({ appId, success: true });
    }
  }
}

export default decorateRoute('/request-analysis', requestAnalysis);
