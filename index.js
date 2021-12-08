const express = require('express'); // express module 가져오기
const app = express(); // new express application make
const port = 5000;

const URL = `mongodb+srv://jiye:${password}@boilerplate.q2otx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const mongoose = require('mongoose');

mongoose
  .connect(URL)
  .then(() => console.log(`MongoDB Connected..!`))
  .catch((err) => console.log(err));

// root directory에 요청이 오면
app.get('/', (request, response) => {
  response.send(`Hello World!`);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});
