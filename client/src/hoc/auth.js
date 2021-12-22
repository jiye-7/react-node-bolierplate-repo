import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../src/_actions/user_action';

/**
 * option
 *  null: 아무나 출입 가능 한 페이지
 *  true: 로그인 한 사용자만 출입이 가능 한 페이지
 *  false: 로그인 한 사용자는 출입이 불가능 한 페이지
 */

export default function (SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // back-end에 Request를 날려서 User의 해당 상태를 가져오는 것 처리
    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log(response);
        // 로그인 하지 않은 상태
        if (!response.payload.isAuth) {
          if (option) {
            navigate('/');
          }
        } else {
          // 로그인 한 상태
          if (adminRoute && !response.payload.isAdmin) {
            // login한 상태, admin이 아닌 경우 -> amdin page로 못 가도록 처리
            navigate('/');
          } else {
            // login한 사용자가 출입 불가능 한 페이지를 가려고 할 때 -> login page, register page 못 들어가도록 처리
            if (option === false) {
              navigate('/');
            }
          }
        }
      });
    }, [dispatch]);

    return <SpecificComponent />;
  }

  return <AuthenticationCheck />;
}
