import { React } from 'react';
// import $ from "jquery";
import { Button } from "antd";


const TestPageYeonhwa = () => {
  const copyCode = () => {
    const codetext = document.getElementById("test");
    codetext.select();
    document.execCommand("copy");
  }
  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <div>
        <input id="test" type="text" />
        <Button onClick={copyCode}>복사</Button>
      </div>
    </div>
  );
};

export default TestPageYeonhwa;