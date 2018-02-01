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
import { sendMessage } from 'containers/App/duck';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import { loadFile, saga } from './duck';
import LoadFile from './LoadFile';

@injectSaga({ key: 'mgk', saga })
@connect(null, (dispatch) => ({
  test() {
    dispatch(sendMessage({ type: 'test', data: { a: 1 } }));
  },
  saveFile(data) {
    return dispatch(loadFile({ data }));
  },
}))
export default class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.test();
  }

  render() {
    const { saveFile } = this.props;
    return (
      <div>
        <LoadFile onSubmit={saveFile} />
      </div>
    );
  }
}
