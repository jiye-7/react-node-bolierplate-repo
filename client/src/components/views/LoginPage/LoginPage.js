import * as axios from 'axios';
import React, { useState } from 'react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onEmailHandler = (e) => {
    // setEmail(e.target.value);
    setEmail(e.currentTarget.value);
  };

  const onPasswordHandler = (e) => {
    setPassword(e.target.value);
  };

  const onSubmitFormHandler = (e) => {
    e.preventDefault(); // page refresh 막기

    // server에 login 요청 보내기
    let body = {
      email,
      password,
    };

    axios
      .post(`/api/users/login`, body)
      .then((response) => console.log(response));
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <form
        onSubmit={onSubmitFormHandler}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <h2>로그인</h2>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          id='email'
          value={email}
          onChange={onEmailHandler}
        />
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={onPasswordHandler}
        />
        <button type='submit'>Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
