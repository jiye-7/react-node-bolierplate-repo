const mongoose = require('mongoose');

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
  // token expiration 토큰 사용 기간
  tokenExp: {
    type: Number,
  },
});

// Schema를 Model로 감싸준다.
// Model의 name, Schema를 넣어준다.
const User = mongoose.model(`User`, userSchema);

module.exports = { User };
