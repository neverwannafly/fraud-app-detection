import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import users from './user';

const reducers = combineReducers({
  users,
});

const middlewares = composeWithDevTools(applyMiddleware(thunk));
const store = createStore(reducers, middlewares);

export default store;
