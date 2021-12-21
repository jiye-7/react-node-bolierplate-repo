import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../../src/_actions/user_action';

export default function (SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    const dispatch = useDispatch();

    // back-end에 Request를 날려서 User의 해당 상태를 가져오는 것 처리
    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log(response);
      });
    }, []);
  }

  return AuthenticationCheck;
}
