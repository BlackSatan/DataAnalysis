import { takeLatest, call, put, take } from 'redux-saga/effects';
import { handleActions, createAction } from 'redux-actions';
import { fromJS } from 'immutable';
import { createSelector } from 'reselect';

import { sendMessage } from 'containers/App/duck';

export const loadFile = createAction(
  '@clusters/load-file',
);

const saveResult = createAction(
  '@clusters/save-result',
  ({ info }) => ({ info })
);

const initialState = fromJS({
  info: {},
});

export default handleActions({
  [saveResult]: (state, { payload }) => state.set('info', fromJS(payload.info)),
}, initialState);

const selectCluster = (state) => state.get('cluster');
export const makeSelectInfo = () => createSelector(
  selectCluster,
  (state) => state.get('info'),
);

function* fileToMatrix(file) {
  const fr = new FileReader();
  fr.readAsText(file);
  const { target: { result } } = yield call(() => new Promise((resolve) => { fr.onload = resolve; }));
  const vectors = result
    .trim()
    .split('\n')
    .map(
      (item) => item.trim().split(' ').map(i => parseFloat(i))
    );
  console.log('vectors', vectors);
  // transpose
  return vectors[0].map((col, i) => vectors.map(row => row[i]));
}

function* loadFileSaga({ payload }) {
  yield put(sendMessage({
    type: 'cluster',
    data: {
      params: yield call(fileToMatrix, payload.data.get('info')[0]),
      x: payload.data.get('x'),
      y: payload.data.get('y'),
      clusters: payload.data.get('clusters'),
      distance: payload.data.get('distance'),
    },
  }));
  const response = yield take('@ws/cluster');
  yield put(saveResult({ info: response.data }));
}

export function* saga() {
  yield takeLatest(loadFile, loadFileSaga);
}
