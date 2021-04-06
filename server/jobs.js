import { Plugins } from 'node-resque';
import { callPythonScript } from './utils';
import { Review } from './models';

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

      Review.collection.insert(reviewObjects, (err) => {
        if (err) jobStatus = false;
      });

      return jobStatus;
    },
  },
};
