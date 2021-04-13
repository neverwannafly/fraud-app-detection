import {
  App, Analysis, UserAnalysis, User,
} from '../models';
import { hasParams } from '../utils';

async function discover(req, res) {
  const params = req.query;

  if (!hasParams(params, ['username'])) {
    res.send({ success: false, error: 'Bad request' });
    return;
  }

  const { username } = params;

  const user = await User.findOne({ username });
  const apps = await App.find({});
  const analyses = await Analysis.find({ appId: { $in: apps.map((app) => app.appId) } });
  const userAnalysis = await UserAnalysis.find(
    { analysisId: { $in: analyses.map((analysis) => analysis.id) } },
  );
  res.send({
    data: {
      user,
      apps,
      analyses,
      userAnalysis,
    },
  });
}

export default [
  '/discover-apps', discover,
];
