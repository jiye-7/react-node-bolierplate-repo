// const proxy = require('http-proxy-middleware');
const { createProxyMiddleware } = require('http-proxy-middleware'); // version up -> 사용방법 달라짐.

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
    /* proxy({
      target: 'http://localhost:5000', // front-end(localhost:3000)에서 줄 때 target을 5000번으로 주겠다고 설정
      changeOrigin: true,
    }) */
  );
};
