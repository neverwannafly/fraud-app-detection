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
  let userAnalysis;
  try {
    if (analysis === null) {
      // eslint-disable-next-line no-param-reassign
      analysis = await Analysis.create({ appId });
    }
    const userId = await captureUser(params);
    // eslint-disable-next-line no-unused-expressions
    userAnalysis = await UserAnalysis.findOne(
      { userId, analysisId: analysis.id },
    ) || await UserAnalysis.create(
      { userId, analysisId: analysis.id },
    );
  } catch (error) {
    // Ignorable error
  }
  jobManager.enqueueJob(appId);
  return { userAnalysis, analysis };
}

async function createApp(appId, params) {
  const application = await searchItunes({ id: appId });
  const app = await App.create({
    appId,
    image: application.artworkUrl512,
    ratingCount: application.userRatingCount,
    genres: application.genres,
    developer: application.artistName,
    name: application.trackName,
    ratings: application.averageUserRating,
    link: application.trackViewUrl,
  });
  const analysisData = await createAnalysis(appId, params);
  return { app, ...analysisData };
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
      const data = await createApp(appId, params);
      res.send({ data, success: true });
    } catch (err) {
      res.send({ success: false, error: err });
    }
  } else {
    const analysis = await Analysis.findOne({ appId });
    const analysisData = await createAnalysis(appId, params, analysis);
    const { isFinished } = analysis;
    const data = {
      app: appObject,
      ...analysisData,
    };

    if (isFinished) {
      res.send({ success: true, data, analysisReady: true });
    } else {
      res.send({ data, success: true });
    }
  }
}

export default decorateRoute('/request-analysis', requestAnalysis);
