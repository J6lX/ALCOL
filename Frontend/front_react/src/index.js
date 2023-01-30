import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import "./App.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // React.StrictMode : 프론트엔드 서버의 오류/버그 확인용(정식 배포 시 제거)
  <React.StrictMode>
    {/* BrowserRouter : 라우터를 쓰기 위한 설정(페이지 별로 다른 URL 부여) */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
