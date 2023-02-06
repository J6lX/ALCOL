const express = require("express");
const app = express();
const port = process.env.PORT;

app.set();
app.listen(port, () => console.log(`Listening on port ${port}`));

//req : 클라이언트에서 서버로 보낼 정보
//res : 서버에서 클라이언트로 보낼 정보
app.get("express_backend", (req, res) => {
  res.send({ express: "express 백엔드가 리액트와 연결되었다." });
});
