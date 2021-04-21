import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import users from './user';
import applications from './application';

const reducers = combineReducers({
  users,
  applications,
});

const middlewares = composeWithDevTools(applyMiddleware(thunk));
const store = createStore(reducers, middlewares);

export default store;
