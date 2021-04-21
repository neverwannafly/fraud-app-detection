import { Analysis, Review } from '../models';
import { hasParams, decorateRoute } from '../utils';

async function fetchApplication(req, res) {
  const params = req.query;

  if (!hasParams(params, ['appId'])) {
    res.send({ success: false, error: 'Bad request' });
    return;
  }
  const { appId } = params;

  const analysis = await Analysis.findOne({ appId });
  if (analysis === null) {
    res.send({ success: false });
    return;
  }

  const { analysisReports } = analysis;
  const latestReportKey = Array.from(analysisReports.keys()).pop();
  const latestReport = analysisReports.get(latestReportKey);

  const goodReviews = JSON.parse(latestReport.good_reviews);
  const badReviews = JSON.parse(latestReport.bad_reviews);
  const { verdict } = latestReport;

  const reviewIds = [
    ...goodReviews.map((r) => Object.keys(r)[0]),
    ...badReviews.map((r) => Object.keys(r)[0]),
  ];

  const reviews = await Review.find({
    _id: { $in: reviewIds },
  });

  res.send({
    success: true,
    data: {
      date: new Date(Number(latestReportKey)),
      verdict,
      goodReviews,
      badReviews,
      reviews,
    },
  });
}

export default decorateRoute('/fetch-application', fetchApplication);
