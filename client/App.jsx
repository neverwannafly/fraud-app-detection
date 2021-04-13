import React from 'react';
import {
  Router, Switch, Route, Redirect,
} from 'react-router-dom';
import { Provider } from 'react-redux';

import { toast } from '@app/utils';

import history from './history';
import LandingPage from './pages/LandingPage';
import DiscoverPage from './pages/DiscoverPage';
import NotFoundPage from './pages/NotFoundPage';
import store from './store/index';

const App = () => (
  <>
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route
            component={LandingPage}
            exact
            path="/"
          />
          <Route
            component={DiscoverPage}
            exact
            path="/discover"
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
    <toast.ToastContainer />
  </>
);

export default App;
