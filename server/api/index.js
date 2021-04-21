// eslint-disable-next-line import/no-cycle
import requestAnalysis from './requestAnalysis';
import fetchUser from './fetchUser';
import discover from './discover';
import requestAnalysisPlay from './requestAnalysisPlay';

export default [
  ['post', requestAnalysis],
  ['post', requestAnalysisPlay],
  ['get', discover],
  ['get', fetchUser],
];
