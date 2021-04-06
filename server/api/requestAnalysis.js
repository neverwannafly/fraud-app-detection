import jobManager from '../jobManager';
import { callPythonScript } from '../utils';

function requestAnalysis(req, res) {
  const parseRegex = /id[0-9]+/;
  const { url } = req.body;
  const appId = url
    .match(parseRegex)[0]
    .slice(2);

  callPythonScript('app_store_review.py', [appId]).then((arr) => console.log(arr));

  res.send({
    success: true,
    hasAnalysisReady: false,
  });

  jobManager.enqueueJob();
}

export default [
  '/request-ananlysis',
  requestAnalysis,
];
