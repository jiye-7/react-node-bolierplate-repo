import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducers'; // './_reducers/index.js'하지 않아도 자동적으로 알아서 처리 해 준다.
import './index.css';
import 'antd/dist/antd.css';

// 원래는 그냥 createStore만 해서 Store를 Redux에서 생성하는 건데 -> 그냥 Store는 plain object(객체)밖에 못 받기 때문에 promise와 function도 받게 해 줄 수 있게 미들웨어와 함께 만들어 주는 것이다.
// -> 여기서 만든 Store를 아래의 Provider store에다가 넣어주면 된다.
const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware,
  ReduxThunk
)(createStore);

ReactDOM.render(
  <React.StrictMode>
    <Provider
      store={createStoreWithMiddleware(
        Reducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      )}
    >
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
