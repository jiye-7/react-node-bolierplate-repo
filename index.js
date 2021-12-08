const express = require('express'); // express module 가져오기
const app = express(); // new express application make
const port = 5000;

// root directory에 요청이 오면
app.get('/', (request, response) => {
  response.send(`Hello World!`);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});
