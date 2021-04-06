import { Plugins } from 'node-resque';

export default {
  analyseApplication: {
    plugins: [Plugins.JobLock],
    pluginOptions: {
      JobLock: { reEnqueue: true },
    },
    perform: async (a, b) => {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      const answer = a + b;
      return answer;
    },
  },
};
