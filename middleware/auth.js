const { User } = require('../models/User');
/**
 * 인증 처리 하는 함수
 * 1. client에서 Cookie에서 Token 가져오기 -> cookie-parser 이용
 * 2. 가져온 Token을 복호화(Decoded)한 후 User를 찾는다.
 * 2-1. User가 있으면 인증 OK
 * 2-2. User가 없으면 인증 NO
 */
let auth = (request, response, next) => {
  // client cookie에서 token 가져오기 -> index.js에 import 한 cookie-parser 모듈이 Cookie header를 분석 한 후 request.cookies에 분석된 것을 넣어주는 역할을 대신 해 준다.
  let token = request.cookie.x_auth;

  // 가져온 token을 복호화 한 후, User model에서 method를 만들 것임.
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    // user가 없으면 client에게 전해주기
    if (!user) return response.json({ isAuth: false, error: true });
    // user가 있으면
    // 여기서 request에 token과 user를 넣어주는 이유는 -> request에 넣어줌으로 인해 index.js에서  '/api/users/auth' 라우트에서 request를 받을 때 request.user를 했을 때 여기서 넣은 user와 token의 정보를 사용할 수 있기 때문에 이 정보를 사용할 수 있게 하기 위함!
    request.token = token;
    request.user = user;
    next();
  });
};

module.exports = { auth };
