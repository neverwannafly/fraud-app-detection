import searchItunes from 'searchitunes';
import jobManager from '../jobManager';

function requestAnalysis(req, res) {
  const parseRegex = /id[0-9]+/;
  const { url } = req.body;
  const appId = url
    .match(parseRegex)[0]
    .slice(2);

  // If appId not present in db
  searchItunes({ id: appId }).then((app) => (
    {
      appUrl: app.artworkUrl512,
      ratingCount: app.userRatingCount,
      genres: app.genres,
      developer: app.artistName,
      name: app.trackName,
      ratings: app.averageUserRating,
      link: app.trackViewUrl,
    }
  ));

  res.send({
    success: true,
    hasAnalysisReady: false,
  });

  jobManager.enqueueJob(appId);
}

export default [
  '/request-ananlysis',
  requestAnalysis,
];
