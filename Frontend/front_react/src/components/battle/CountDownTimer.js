import React from "react";
// import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
// import { Button, Progress } from "antd";
// import { useState } from "react";

const CountDownTimer = () => {
  const [[hours, mins, secs], setTime] = React.useState([1, 0, 0]);

  const tick = () => {
    if (hours === 0 && mins === 0 && secs === 0) {
    } else if (mins === 0 && secs === 0) {
      setTime([hours - 1, 59, 59]);
    } else if (secs === 0) {
      setTime([hours, mins - 1, 59]);
    } else {
      setTime([hours, mins, secs - 1]);
    }
  };

  React.useEffect(() => {
    //1초
    const timerId = setInterval(() => tick(), 1000);
    return () => clearInterval(timerId);
  });

  return (
    <div>
      <p className="NanumSquare" style={{ color: "black", fontSize: "2.5vh", marginRight: "20px" }}>
        {`${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs
          .toString()
          .padStart(2, "0")}`}
      </p>
    </div>
  );
};

export default CountDownTimer;
