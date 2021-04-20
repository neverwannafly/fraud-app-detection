/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import {
  Worker, Scheduler, Queue,
} from 'node-resque';

import jobs from './jobs';
import { workerConnectionDetails } from './constants';

class JobManager {
  constructor() {
    this.connection = { connection: workerConnectionDetails };
    this.pendingJobs = 0;
    this.worker = new Worker(
      { ...this.connection, queues: ['default'] },
      jobs,
    );
    this.scheduler = new Scheduler(this.connection);
    this.queue = new Queue(this.connection, jobs);

    this._initLogging();
    this._initialize();
  }

  enqueueJob(appId) {
    this.pendingJobs += 1;
    this.queue.enqueue(
      'default',
      'analyseApplication',
      [appId],
    );
    this.queue.enqueue(
      'default',
      'performSentimentAnalysis',
      [appId],
    );
  }

  async _initialize() {
    await this.worker.connect();
    this.worker.start();

    await this.scheduler.connect();
    this.scheduler.start();

    await this.queue.connect();
  }

  async _tryShutdown() {
    if (this.pendingJobs === 0) {
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
      await this.scheduler.end();
      await this.worker.end();
      process.exit();
    }
  }

  async _afterFinish() {
    this.pendingJobs -= 1;
    this._tryShutdown();
  }

  _initLogging() {
    this.worker.on('start', () => {
      console.log('worker started');
    });
    this.worker.on('end', () => {
      console.log('worker ended');
    });
    this.worker.on('success', (queue, job, result, duration) => {
      console.log(
        `job success ${queue} ${JSON.stringify(job)} >> ${result} (${duration}ms)`,
      );
    });
    this.worker.on('failure', (queue, job, failure, duration) => {
      console.log(
        `job failure ${queue} ${JSON.stringify(
          job,
        )} >> ${failure} (${duration}ms)`,
      );
    });
    this.worker.on('error', (error, queue, job) => {
      console.log(`error ${queue} ${JSON.stringify(job)}  >> ${error}`);
    });

    this.scheduler.on('start', () => {
      console.log('scheduler started');
    });
    this.scheduler.on('end', () => {
      console.log('scheduler ended');
    });
    this.scheduler.on('error', (error) => {
      console.log(`scheduler error >> ${error}`);
    });
    this.scheduler.on('cleanStuckWorker', (workerName, errorPayload, delta) => {
      console.log(
        `failing ${workerName} (stuck for ${delta}s) and failing job ${errorPayload}`,
      );
    });
    this.scheduler.on('transferredJob', (timestamp, job) => {
      console.log(`scheduler enquing job ${timestamp} >> ${JSON.stringify(job)}`);
    });

    this.queue.on('error', (error) => {
      console.log(error);
    });
  }
}

const jobManager = new JobManager();

export default jobManager;
