import axios from 'axios';
import { LOGIN_USER, REGISTER_USER, AUTH_USER } from './types';

export function loginUser(dataToSubmit) {
  // server에 login 요청을 보내고, response 받은 것에 data를 request에 저장
  const request = axios
    .post('/api/users/login', dataToSubmit)
    .then((response) => response.data);

  // return시켜서 Reducer로 보내야 된다. reducer에서 previousState, action(현재) -> 교합해서 다음 state를 만들어 줘야 된다.
  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function registerUser(dataToSubmit) {
  const request = axios
    .post('/api/users/register', dataToSubmit)
    .then((response) => response.data);

  return {
    type: REGISTER_USER,
    payload: request,
  };
}

export function auth() {
  // get method -> body 부분 필요 없음
  const request = axios
    .get('/api/users/auth')
    .then((response) => response.data);

  return {
    type: AUTH_USER,
    payload: request,
  };
}
