const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, // trim: 공백을 없애주는 기능을 함 ex) qwe rt@email.com -> qwert@email.com
    unique: 1, // 똑같은 것 허용 안함
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number, // 1: 관리자, 0: 일반 사용자
    default: 0,
  },
  image: String,
  token: {
    type: String, // 유효성 관리
  },
  // token expiration 토큰d 사용 기간
  tokenExp: {
    type: Number,
  },
});

// mongoose에서 가져온 method
// 'save' -> user model에 user정보를 저장하기 전에 ~~을 한다.
// 이 함수가 다 끝난 다음에 다시 user.save()로 들어가는 것!
userSchema.pre('save', function (next) {
  var user = this; // 위의 userSchema를 가리킨다.

  // 비밀번호 변경 요청이 들어왔을 때만 비밀번호 변경이 일어나야 된다. -> model 안 filed 중에 password가 변환 될 때만 bcrypt를 이용하여 암호화 하기
  if (user.isModified('password')) {
    // 비밀번호 암호화 하기 (bcrypt) -> bcrypt가져와서 slat 만들 때: saltRounds 필요. 콜백 함수로 핸들링
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      // slat가 제대로 생성 됐을 때 : bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {});
      //  -> myPlaintextPassword: 사용자(client에서 입력해서 받아 온 비밀번호 (암호화 전 비밀번호)) -> request.body를 user model에 넣어놨으니까, userSchema.password에서 가져올 수 있다.
      //  -> salt: 생성 된 salt 가져오기
      bcrypt.hash(user.password, salt, function (err, hash) {
        // hash: 암호화 된 비밀번호!
        if (err) return next(err); // next(); // save()로 보내버리는 것!

        // hash를 잘 만들었다면, plain password를 hash된 password로 변경 해 준다.
        user.password = hash;
        next();
      });
    });
  }
});

// Schema를 Model로 감싸준다.
// Model의 name, Schema를 넣어준다.
const User = mongoose.model(`User`, userSchema);

module.exports = { User };
