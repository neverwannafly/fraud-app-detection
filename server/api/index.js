import requestAnalysis from './requestAnalysis';
import discover from './discover';

export default [
  ['post', requestAnalysis],
  ['get', discover],
];
