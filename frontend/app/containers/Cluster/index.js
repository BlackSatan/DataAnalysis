/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { sendMessage } from 'containers/App/duck';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import reducer, { loadFile, saga, makeSelectInfo } from './duck';
import LoadFile from './LoadFile';
import DataOutput from './DataOutput';

@injectReducer({ key: 'cluster', reducer })
@injectSaga({ key: 'cluster', saga })
@connect(createStructuredSelector({
  info: makeSelectInfo(),
}), (dispatch) => ({
  test() {
    dispatch(sendMessage({ type: 'test', data: { a: 1 } }));
  },
  saveFile(data) {
    dispatch(loadFile({ data }));
  },
}))
export default class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.test();
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    // You can also log the error to an error reporting service
    console.log(error, info);
  }

  render() {
    const { saveFile, info } = this.props;
    return (
      <div>
        <LoadFile onSubmit={saveFile} />
        {info.has('clusterized') ? <DataOutput {...info.toJS()} /> : <div />}
      </div>
    );
  }
}
