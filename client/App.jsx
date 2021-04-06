import React from 'react';
import {
  Router, Switch, Route, Redirect,
} from 'react-router-dom';
import { Provider } from 'react-redux';

import history from './history';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import store from './store';

const App = () => (
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route
          component={Landing}
          exact
          path="/"
        />
        <Route
          component={NotFound}
          exact
          path="/404"
        />
        <Redirect to="/404" />
      </Switch>
    </Router>
  </Provider>
);

export default App;
