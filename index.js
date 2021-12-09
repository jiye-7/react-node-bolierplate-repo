const express = require('express'); // express module 가져오기
const bodyParser = require('body-parser');
const app = express(); // new express application make
const { User } = require('./models/User');
const port = 5000;
const URL = `mongodb+srv://jiye:${password}@boilerplate.q2otx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// bodyParser option
// application/x-222-form-urlencoded  // 이렇게 된 data를 분석해서 가져올 수 있게 해주는 코드
app.use(bodyParser.urlencoded({ extended: true }));
// application.json type으로 된 것을 분석해서 가져올 수 있게 해주는 코드
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose
  .connect(URL)
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
app.post('/register', (request, response) => {
  // 가져온 User를 이용해서 instance를 만든다.
  const user = new User(request.body); // request body안에는 json 형식으로 값들이 담겨서 넘어온다. -> request body에 들어있을 수 있는 이유는 body-parser가 있기 때문.
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

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});
