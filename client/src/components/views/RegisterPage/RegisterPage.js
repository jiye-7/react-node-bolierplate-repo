import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onEmailHandler = (e) => {
    setEmail(e.currentTarget.value);
  };

  const onNameHandler = (e) => {
    setName(e.currentTarget.value);
  };

  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value);
  };

  const onConfirmPasswordHandler = (e) => {
    setConfirmPassword(e.currentTarget.value);
  };

  const onSubmitFormHandler = (e) => {
    e.preventDefault();

    // password, confirmPassword 같을 때 회원가입 진행
    if (password !== confirmPassword) {
      return alert('비밀번호와 비밀번호 확인은 같아야 합니다!');
    }

    let body = {
      email,
      name,
      password,
    };

    dispatch(registerUser(body)).then((response) => {
      if (response.payload.success) {
        navigate('/login');
      } else {
        alert('Failed to sign up..');
      }
    });
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
        <h2>회원가입</h2>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          id='email'
          value={email}
          onChange={onEmailHandler}
        />
        <label htmlFor='name'>Name</label>
        <input type='text' id='name' value={name} onChange={onNameHandler} />
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={onPasswordHandler}
        />
        <label htmlFor='passwordConfirm'>Password Confirm</label>
        <input
          type='password'
          id='passwordConfirm'
          value={confirmPassword}
          onChange={onConfirmPasswordHandler}
        />
        <button type='submit'>Sign Up</button>
      </form>
    </div>
  );
}

export default RegisterPage;
