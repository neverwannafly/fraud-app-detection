/* eslint-disable no-console */
import { Plugins } from 'node-resque';
import { callPythonScript } from './utils';
import { Review, Analysis } from './models';

export default {
  analyseApplication: {
    plugins: [Plugins.JobLock],
    pluginOptions: {
      JobLock: { reEnqueue: true },
    },
    perform: async (appId) => {
      const response = await callPythonScript('app_store_review.py', [appId]);
      const { success, reviews } = response;
      let jobStatus = true;
      const reviewObjects = [];

      if (success) {
        reviews.forEach((review) => {
          reviewObjects.push({
            appId,
            ...review,
          });
        });
      }

      try {
        await Review.insertMany(reviewObjects, { ordered: false });
      } catch (err) {
        if (err.name !== 'BulkWriteError') {
          console.log(err);
          jobStatus = false;
        }
      }

      return jobStatus;
    },
  },
  performSentimentAnalysis: {
    plugins: [Plugins.JobLock],
    pluginOptions: {
      JobLock: { reEnqueue: true },
    },
    perform: async (appId) => {
      const response = await callPythonScript('sentiment_analysis.py', [appId]);
      const { success, report } = response;
      let jobStatus = true;

      if (!success) {
        return false;
      }

      try {
        const analysis = await Analysis.findOne({ appId });
        const timestamp = `${(new Date()).getTime()}`;
        analysis.analysisReports.set(timestamp, report);
        analysis.isFinished = true;
        await analysis.save({ new: true });
      } catch (err) {
        console.log(err);
        jobStatus = false;
      }

      return jobStatus;
    },
  },
};
