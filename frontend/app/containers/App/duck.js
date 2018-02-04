import { takeEvery, call, put, fork, take, select } from 'redux-saga/effects';
import { channel } from 'redux-saga';
import Sockette from 'sockette';
import { fromJS } from 'immutable';
import { handleActions, createAction } from 'redux-actions';
import { createSelector } from 'reselect';

export const sendMessage = createAction(
  '@socket/create-message',
  ({ type, data }) => ({ type, data })
);

const init = createAction(
  '@socket/init',
  ({ ws }) => ({ ws })
);

const initialState = fromJS({
  ws: null,
});

export default handleActions({
  [init]: (state, { payload: { ws } }) => state.set('ws', ws),
}, initialState);

const selectApp = (state) => state.get('app');

const makeSelectWs = () => createSelector(
  selectApp,
  (state) => state.get('ws')
);

function* sendMessageSaga({ payload: { type, data } }) {
  const ws = yield select(makeSelectWs());
  ws.send(JSON.stringify({
    type,
    data,
  }));
}

function connect(responses) {
  return new Promise((resolve) => {
    const ws = new Sockette('ws://localhost:5678', {
      timeout: 5e3,
      maxAttempts: 10,
      onopen: () => resolve(ws),
      onmessage: (e) => {
        responses.put(JSON.parse(e.data));
      },
      onreconnect: (e) => console.log('Reconnecting...', e),
      onclose: (e) => console.log('Closed!', e),
      onerror: (e) => console.log('Error:', e),
    });
  });
}

function* watchResponses(responsesChannel) {
  while (true) {
    const action = yield take(responsesChannel);
    yield put({
      ...action,
      type: `@ws/${action.type}`,
    });
  }
}

export function* saga() {
  const responsesChannel = channel();
  const ws = yield call(connect, responsesChannel);
  yield put(init({ ws }));

  yield fork(watchResponses, responsesChannel);
  // ws.close(); // graceful shutdown
  yield takeEvery(sendMessage, sendMessageSaga);
}
