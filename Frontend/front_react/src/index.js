import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import "./App.css";
import { RecoilRoot } from "recoil";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // React.StrictMode : 프론트엔드 서버의 오류/버그 확인용(정식 배포 시 제거)
  // <React.StrictMode>
  <RecoilRoot>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </RecoilRoot>
  // </React.StrictMode>,
  // document.getElementById("root")
);
