import searchItunes from 'searchitunes';
import gPlayScraper from 'google-play-scraper';
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

async function createApp(appID, params) {
  
  const application = await gPlayScraper.app({appId: appID});
  const app = await App.create({
    appId: appID,
    image: application.icon,
    ratingCount: application.ratings,
    genres: application.genre,
    developer: application.developer,
    name: application.title,
    ratings: application.score,
    link: application.url,
    appType: 'ANDROID',
  });
  const analysisData = await createAnalysis(appID, params);
  return { app, ...analysisData };
}

function getAppId(parans) {
  let appId;
  try {
    const { url } = parans;
    const parseRegex = '(?<=[?&]id=)[^&]+';

    appId = url
      .match(parseRegex)[0];
  } catch (err) {
    appId = null;
  }

  return appId;
}

async function requestAnalysisPlay(req, res) {
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

  export default decorateRoute('/request-analysis-play', requestAnalysisPlay);
