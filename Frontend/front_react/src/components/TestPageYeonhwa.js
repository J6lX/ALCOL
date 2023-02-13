import { React } from "react";
// import $ from "jquery";
import { Button } from "antd";
import countDown from "../assets/count_down.mp4";

const TestPageYeonhwa = () => {
  const copyCode = () => {
    const codetext = document.getElementById("test");
    codetext.select();
    document.execCommand("copy");
  };
  return (
    <div>
      <video src={countDown} autoPlay muted style={{ width: "100vw", height: "100vh" }}></video>
      <div>
        <input id="test" type="text" />
        <Button onClick={copyCode}>복사</Button>
      </div>
    </div>
  );
};

export default TestPageYeonhwa;
