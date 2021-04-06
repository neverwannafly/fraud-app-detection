import { Plugins } from 'node-resque';
import { callPythonScript } from './utils';

export default {
  analyseApplication: {
    plugins: [Plugins.JobLock],
    pluginOptions: {
      JobLock: { reEnqueue: true },
    },
    perform: async (appId) => {
      const response = await callPythonScript('app_store_review.py', [appId]);
      console.log(response.success);
      console.log(response.reviews.length);
    },
  },
};
