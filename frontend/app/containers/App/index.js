/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { compose } from 'redux';
import { Switch, Route } from 'react-router-dom';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import HomePage from 'containers/HomePage/Loadable';
import Factor from 'containers/Factor/Loadable';
import Cluster from 'containers/Cluster/Loadable';
import TimeSeries from 'containers/TimeSeries/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import AppBar from 'components/AppBar';

import reducer, { saga } from './duck';


function App() {
  return (
    <div>
      <AppBar />
      <Switch>
        <Route path="/cluster" component={Cluster} />
        <Route path="/factor" component={Factor} />
        <Route path="/ts" component={TimeSeries} />
        <Route exact path="/" component={HomePage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
}

export default compose(
  injectSaga({ key: 'app', saga }),
  injectReducer({ key: 'app', reducer }),
)(App);
