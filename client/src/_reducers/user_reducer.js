import { LOGIN_USER, REGISTER_USER } from '../_actions/types';
/**
 * User Reducer 만들기 (login, register 기능등을 만들 때 하나 씩 추가 해 볼 것이다.)
 * state <- previousState, action.type <- switch문에서 key!
 */
export default function (state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      // spred operater(똑같이 가져오는 것)
      return { ...state, loginSuccess: action.payload };
      break;
    case REGISTER_USER:
      return { ...state, register: action.payload };
      break;
    default:
      return state;
  }
}
