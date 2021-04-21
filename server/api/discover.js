import {
  App, Analysis, UserAnalysis, User,
} from '../models';
import { hasParams, decorateRoute } from '../utils';

async function discover(req, res) {
  const params = req.query;

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
  }]).sort({ _id: -1 });

  const analyses = await Analysis
    .find({ appId: { $in: apps.map((app) => app.appId) } })
    .select(['appId', 'isFinished', '_id']);
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

export default decorateRoute('/discover-apps', discover);
