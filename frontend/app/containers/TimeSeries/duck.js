import { takeLatest, call, put, take, select } from 'redux-saga/effects';
import { handleActions, createAction } from 'redux-actions';
import { fromJS } from 'immutable';
import { createSelector } from 'reselect';

import { sendMessage } from 'containers/App/duck';

export const loadFile = createAction(
  '@ts/load-file',
);

const saveResult = createAction(
  '@ts/save-result',
  ({ info }) => ({ info })
);

export const removeItem = createAction(
  '@ts/remove-item',
  ({ index }) => ({ index })
);

export const updateData = createAction(
  '@ts/update-data',
);

export const submitRollingForm = createAction(
  '@ts/submit-rolling',
  ({ data }) => ({ data })
);

export const setRollingData = createAction(
  '@ts/set-rolling',
  ({ rolling }) => ({ rolling })
);


const initialState = fromJS({
  info: {
    data: [1, 5, 15],
    auto_corr: [],
    abnormal: []
  },
  isInitialized: true,
  isDataChanged: false,
});

export default handleActions({
  [saveResult]: (state, { payload }) => state
    .set('isInitialized', true)
    .set('isDataChanged', false)
    .set('info', fromJS(payload.info)),
  [removeItem]: (state, { payload }) => state
    .updateIn(['info', 'data'], data => data.set(payload.index, (parseFloat(data.get(payload.index - 1)) + parseFloat(data.get(payload.index + 1))) / 2))
    .set('isDataChanged', true),
  [setRollingData]: (state, { payload }) => state.setIn(['info', 'rolling'], fromJS(payload.rolling)),
}, initialState);

const selectTs = (state) => state.get('ts');

export const makeSelectInfo = () => createSelector(
  selectTs,
  (state) => state.get('info'),
);

export const makeSelectIsInitialized = () => createSelector(
  selectTs,
  (state) => state.get('isInitialized'),
);

export const makeSelectIsDataChanged = () => createSelector(
  selectTs,
  (state) => state.get('isDataChanged'),
);

function* fileToArray(file) {
  const fr = new FileReader();
  fr.readAsText(file);
  const { target: { result } } = yield call(() => new Promise((resolve) => { fr.onload = resolve; }));
  return result
    .trim()
    .split('\n')
}

function* loadFileSaga({ payload }) {
  yield put(sendMessage({
    type: 'ts',
    data: yield call(fileToArray, payload.data.get('info')[0]),
  }));
  const response = yield take('@ws/ts');
  yield put(saveResult({ info: response.data }));
}

function* updateDataSaga() {
  const info = yield select(makeSelectInfo());
  yield put(sendMessage({
    type: 'ts',
    data: info.get('data').toJS(),
  }));
  const response = yield take('@ws/ts');
  yield put(saveResult({ info: response.data }));
}

function* submitRollingFormSaga({ payload }) {
  const info = yield select(makeSelectInfo());
  yield put(sendMessage({
    type: 'ts-rolling',
    data: {
      data: info.get('data').toJS(),
      window: parseInt(payload.data.get('window')),
    },
  }));
  const response = yield take('@ws/ts-rolling');
  yield put(setRollingData({ rolling: response.data }));
}

export function* saga() {
  yield takeLatest(loadFile, loadFileSaga);
  yield takeLatest(updateData, updateDataSaga);
  yield takeLatest(submitRollingForm, submitRollingFormSaga);
}
