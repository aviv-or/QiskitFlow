import { takeLatest, take, call, put, select } from 'redux-saga/effects';
import request from 'utils/request';

// Individual exports for testing
import { USER_LOGIN, GET_PROFILE, USER_LOGOUT } from '../App/constants';
import { loginErrorAction, loginSuccessAction, profileAction } from '../App/actions';

export function* getToken({ username, password }) {
  const tokenUrl =
    'https://run.mocky.io/v3/ae412de5-ab8f-4ef9-842d-c340c973a28e';

  try {
    const response = yield call(request, tokenUrl);
    const token = response.access;
    localStorage.setItem('token', token);
    yield put(profileAction());
  } catch (err) {
    yield put(loginErrorAction(err));
  }
}

export function* getProfile() {
  const profileUrl =
    'https://run.mocky.io/v3/a8f96d06-98bd-4dcd-a489-7d6f3b869bfb';

  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = yield call(request, profileUrl);
      yield put(loginSuccessAction(response));
    } catch (err) {
      yield put(loginErrorAction(err));
    }
  }
}

export function* logout() {
  localStorage.removeItem('token');
}

export default function* loginSaga() {
  yield takeLatest(USER_LOGIN, getToken);
  yield takeLatest(GET_PROFILE, getProfile);
  yield takeLatest(USER_LOGOUT, logout);
}
