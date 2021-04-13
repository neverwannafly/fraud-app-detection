import {
  App, Analysis, UserAnalysis, User,
} from '../models';
import { hasParams } from '../utils';

async function discover(req, res) {
  const params = req.query;

  await new Promise((resolve) => setTimeout(() => resolve(), 2000));
  if (!hasParams(params, ['username'])) {
    res.send({ success: false, error: 'Bad request' });
    return;
  }

  const { username, query } = params;

  const user = await User.findOne({ username }) || {};
  const apps = await App.aggregate([{
    $match: {
      name: { $regex: query, $options: 'i' },
    },
  }]);
  const analyses = await Analysis.find({ appId: { $in: apps.map((app) => app.appId) } });
  const userAnalysis = await UserAnalysis.aggregate([
    {
      $group: {
        _id: '$analysisId',
        count: { $sum: 1 },
      },
    },
  ]);
  const currentUserAnalysis = await UserAnalysis.where({
    userId: user.id, analysisId: { $in: analyses.map((analysis) => analysis.id) },
  });
  res.send({
    data: {
      user,
      apps,
      analyses,
      userAnalysis,
      currentUserAnalysis,
    },
    success: true,
  });
}

export default [
  '/discover-apps', discover,
];
