const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
    type: Number, // 1: 관리자, 0: 일반 사용자(우선 auth check에는 0이 아닐 때 다 관리자로 처리할 것이다.)
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
  } else {
    // 비밀번호 변경이 아니라 다른 정보를 바꿀 때 나갈 수 있도록 처리
    next();
  }
});

// comparePassword method
userSchema.methods.comparePassword = function (plainPassword, callback) {
  // 비밀번호 비교할 때 plainPassword(ex) 12345678)가 있고, DB에 있는 암호화 된 password(ex) $2b$10$6whd12w9KPexTQ4QuF2nyuIVzLXLS8VJR2YR52APt9s/4qtkw0UhG) -> 이 2가지가 같은지를 체크 해야 된다.
  // plainPassword를 암호화 한 다음에 DB에 있는 암호화 된 password와 맞는 지 체크 필요! => 이미 암호화 된 비밀번호를 다시 복호화 할 수는 없다.
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    // 비밀번호 일치 하지 않으면
    if (err) return callback(err);

    // 비밀번호가 같다면 -> error는 없으니까 null처리, isMatch(true)
    callback(null, isMatch);
  });
};

// generateToken method
userSchema.methods.generateToken = function (callback) {
  var user = this;

  // jsonwebtoken을 이용하여 token 생성 -> _id: DataBase에 있는 id! / '아무 문자열' => _id + '해당 문자열' => token이 생성! => 나중에 token을 해석할 때 '해당 문자열'을 넣으면 => 다시 _id가 나온다. => 로그인 한 user가 누구인 지 알 수 있다.
  var token = jwt.sign(user._id.toHexString(), 'secretToken');

  // userSchema의 token filed에 token을 넣어준다.
  user.token = token;
  user.save(function (err, user) {
    if (err) return callback(err);
    // save가 잘 되었을 경우 -> error는 없으니까 null을 넣고, user정보를 보내준다.
    callback(null, user);
  });
};

// token check method
userSchema.statics.findByToken = function (token, callback) {
  var user = this;

  // 가져온 token을 decoded(복호화)한다. (verify a token symmetric)
  jwt.verify(token, 'secretToken', function (err, decoded) {
    // decoded된 userID를 이용해서 해당 User를 찾는다.
    // client에서 가져 온 token과 DB에 보관되어 있는 token이 일치하는 지 비교한다.
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return callback(err);
      // error가 없을 경우 user 정보 전달해주기
      callback(null, user);
    });
  });
};

// Schema를 Model로 감싸준다.
// Model의 name, Schema를 넣어준다.
const User = mongoose.model(`User`, userSchema);

module.exports = { User };
