import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    axios
      // .get('http://localhost:5000/api/hello')
      .get('/api/hello')
      .then((response) => console.log(response));
  }, []);

  const onLogoutHandler = () => {
    axios.get('/api/users/logout').then((response) => {
      if (!response.data.success) {
        alert('로그아웃하는 과정에서 실패 했습니다..!');
      }
      navigate('/login');
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
      <div>
        <h2>시작 페이지</h2>
      </div>
      <div>
        <button onClick={onLogoutHandler}>로그아웃</button>
      </div>
    </div>
  );
}
