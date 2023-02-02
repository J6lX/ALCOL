// 프록시 설정(로컬 환경에서 테스트할 때 사용, 실제 빌드 및 배포 환경에서 사용하지 않음)
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/apicontext", {
      target: "http://localhost:8080", // 서버 URL or localhost:설정한포트번호
      changeOrigin: true,
    })
  );
};
