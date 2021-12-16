import { combineReducers } from 'redux';
import user from './user_reducer';

const rootReducer = combineReducers({
  user,
});

// 다른 파일에서 이 리듀설르 사용할 수 있도록 import 해주기
export default rootReducer;
