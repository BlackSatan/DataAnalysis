import { takeLatest, call, put } from 'redux-saga/effects';
import { createAction } from 'redux-actions';
import { sendMessage } from 'containers/App/duck';

export const loadFile = createAction(
  '@mgk/load-file',
);

function* loadFileSaga({ payload }) {
  const fr = new FileReader();
  fr.readAsText(payload.data.info);
  const { target: { result } } = yield call(() => new Promise((resolve) => { fr.onload = resolve; }));
  const matrix = result.split('\n').map((item) => item.split(' '));
  yield put(sendMessage({
    type: 'mgk',
    data: matrix,
  }));
}

export function* saga() {
  yield takeLatest(loadFile, loadFileSaga);
}
