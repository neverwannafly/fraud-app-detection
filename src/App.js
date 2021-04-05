import React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';

import history from './history';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import { store } from './store';

const App = () => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route exact path='/' component={Landing} />
          <Route exact path='/notfound' component={NotFound} />
          <Redirect to='/notfound' />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;