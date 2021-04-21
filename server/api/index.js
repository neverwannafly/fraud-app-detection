// eslint-disable-next-line import/no-cycle
import requestAnalysis from './requestAnalysis';
import fetchApplication from './fetchApplication';
import fetchUser from './fetchUser';
import discover from './discover';

export default [
  ['post', requestAnalysis],
  ['get', discover],
  ['get', fetchApplication],
  ['get', fetchUser],
];
