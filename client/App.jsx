import React from 'react';
import {
  Router, Switch, Route, Redirect,
} from 'react-router-dom';
import { Provider } from 'react-redux';

import history from './history';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import store from './store/index';

const App = () => (
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route
          component={LandingPage}
          exact
          path="/"
        />
        <Route
          component={NotFoundPage}
          exact
          path="/404"
        />
        <Redirect to="/404" />
      </Switch>
    </Router>
  </Provider>
);

export default App;
