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
      let response;
      if(appId[0]!='c'){
        response = await callPythonScript('app_store_review.py', [appId]);
      }else{
        response = await callPythonScript('play_store_review.py', [appId]);
      }
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
        jobStatus = false;
        // Ignore error
      }

      return jobStatus;
    },
  },
};
