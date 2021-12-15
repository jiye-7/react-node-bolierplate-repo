const express = require('express'); // express module 가져오기
const app = express(); // new express application make
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require('./models/User');

// bodyParser option
// application/x-222-form-urlencoded  // 이렇게 된 data를 분석해서 가져올 수 있게 해주는 코드
app.use(bodyParser.urlencoded({ extended: true }));
// application.json type으로 된 것을 분석해서 가져올 수 있게 해주는 코드
app.use(bodyParser.json());

// cookieParser 사용
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose
  .connect(config.mongoURI)
  .then(() => console.log(`MongoDB Connected..!`))
  .catch((err) => console.log(err));

// root directory에 요청이 오면
app.get('/', (request, response) => {
  response.send(`Hello World!`);
});

/**
 * register(signUp) router: 회원 가입 라우터
 * 1. 회원 가입 할 때 필요 한 정보들을 client에서 가져와서
 * 2. DataBase에 넣기
 */
app.post('/api/users/register', (request, response) => {
  // 가져온 User를 이용해서 instance를 만든다.
  const user = new User(request.body); // request body안에는 json 형식으로 값들이 담겨서 넘어온다. -> request body에 들어있을 수 있는 이유는 body-parser가 있기 때문.

  // mongoose의 기능을 이용하여 비밀번호 암호화

  // mongoDB에서 오는 method, save() -> 정보들이 User model에 저장 됨, 콜백 함수
  user.save((err, userInfo) => {
    // userInfo: 저장 한 userInfo
    // error가 있을 경우 json형태로 success값과 err메시지를 전달
    if (err) {
      return response.json({ success: false, err });
    }
    // 저장에 성공했을 경우, 성공 코드, json 형식으로 정보 전달
    return response.status(200).json({ success: true });
  });
});

/**
 * : 로그인 라우터
 * 1. 요청 된 email이 DB에 있는 지 찾는다.
 * 2. DB에 해당 요청 된 email이 존재한다면, 입력한 비밀번호와 DB에 있는 비밀번호가 같은 지 확인한다.
 * 3. 비밀번호까지 일치한다면 해당 user를 위한 Token을 생성한다.
 */
app.post('/api/users/login', (request, response) => {
  // 1. 요청 된 email이 DB에 있는 지 찾는다. : DB에서 찾기 위해 user model을 가져온다. -> findOne method: mongoDB에서 제공
  User.findOne({ email: request.body.email }, (err, user) => {
    if (!user) {
      return response.json({
        loginSuccess: false,
        message: '제공 된 이메일에 해당하는 사용자가 없습니다..:(',
      });
    }
    // 2. 요청 된 email이 DB에 있다면, 비밀번호가 맞는 비밀번호인지 확인 ->
    user.comparePassword(request.body.password, (err, isMatch) => {
      // 비밀번호가 같지 않음 === 틀림
      if (!isMatch)
        return response.json({
          loginSuccess: false,
          message: '비밀번호가 틀렸습니다.',
        });

      // 비밀번호까지 일치 할 경우 -> 토큰 생성!
      user.generateToken((err, user) => {
        if (err) return response.status(400).send(err);

        // token을 저장 -> token을 저장하는 방법은 여러가지 (user.token으로 token을 넣어주었기 때문에 user에는 token이 저장되어 있다.)
        // cookie, LocalStorage, Session 에도 저장 할 수 있다. -> 어디다 저장하는 것이 가장 안전한지는 더 생각해 보기
        // cookie에 token을 저장한다. => 쿠키에 저장하기 위해서 라이브러리 하나를 추가 (express에서 제공되는 cookie-parser 추가)
        response
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

/**
 * Auth check route
 */
app.get('/api/users/auth', auth, (request, response) => {
  // 여기까지 auth middle ware를 통과해서 왔다 -> Authentication이 true!
  // client에게 true 정보를 보내줘야 된다. -> user 정보들을 제공해주면 된다. (필요한 정보 선택해서 보내주면 됨)
  response.status(200).json({
    _id: request.user._id,
    isAdmin: request.user.role === 0 ? false : true,
    isAuth: true,
    email: request.user.email,
    name: request.user.name,
    lastname: request.user.lastname,
    role: request.user.role,
    image: request.user.image,
  });
});

/**
 * Logout route
 * -> login 된 상태이기 때문에 auth middleware를 넣어준다.
 */
app.get('/api/users/logout', auth, (request, response) => {
  console.log(request.user);
  // 해당 User를 찾아서 Data들을 update 시켜준다.
  User.findOneAndUpdate(
    { _id: request.user._id },
    { token: '' },
    (err, user) => {
      if (err) return response.json({ success: false, err });
      return response.status(200).send({ success: true });
    }
  );
});

/** axios request /api/hello */
app.get('/api/hello', (request, response) => {
  response.send(`cross origin issue handling :)`);
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});
