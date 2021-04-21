// eslint-disable-next-line import/no-cycle
import requestAnalysis from './requestAnalysis';
import fetchUser from './fetchUser';
import discover from './discover';

export default [
  ['post', requestAnalysis],
  ['get', discover],
  ['get', fetchUser],
];
