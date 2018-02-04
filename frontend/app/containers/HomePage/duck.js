import { takeLatest, call, put, take } from 'redux-saga/effects';
import { handleActions, createAction } from 'redux-actions';
import { fromJS } from 'immutable';
import { createSelector } from 'reselect';

import { sendMessage } from 'containers/App/duck';

export const loadFile = createAction(
  '@mgk/load-file',
);

const saveResult = createAction(
  '@mgk/save-result',
  ({ info }) => ({ info })
);

const initialState = fromJS({
  info: {},
});

export default handleActions({
  [saveResult]: (state, { payload }) => state.set('info', fromJS(payload.info)),
}, initialState);

const selectMgk = (state) => state.get('mgk');
export const makeSelectInfo = () => createSelector(
  selectMgk,
  (state) => state.get('info'),
);

function* fileToMatrix(file) {
  const fr = new FileReader();
  fr.readAsText(file);
  const { target: { result } } = yield call(() => new Promise((resolve) => { fr.onload = resolve; }));
  return result
    .trim()
    .split('\n')
    .map(
      (item) => item.trim().split(' ')
    );
}

function* loadFileSaga({ payload }) {
  yield put(sendMessage({
    type: 'mgk',
    data: {
      params: yield call(fileToMatrix, payload.data.get('info')[0]),
      threshold: payload.data.get('threshold'),
    },
  }));
  const response = yield take('@ws/mgk');
  yield put(saveResult({ info: response.data }));
}

export function* saga() {
  yield takeLatest(loadFile, loadFileSaga);
}
