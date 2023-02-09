import React from "react";
// import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
// import { Button, Progress } from "antd";
// import { useState } from "react";

const CountDownTimer = () => {
  const [[hours, mins], setTime] = React.useState([120, 0]);

  const tick = () => {
    if (hours === 0 && mins === 0) {
    } else if (mins === 0) {
      setTime([hours - 1, 59]);
    } else {
      setTime([hours, mins - 1]);
    }
  };

  React.useEffect(() => {
    //1초
    const timerId = setInterval(() => tick(), 60000);
    return () => clearInterval(timerId);
  });

  return (
    <div>
      <p className="NanumSquare" style={{ color: "black", fontSize: "2.5vh", marginRight: "20px" }}>
        {`${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`}
      </p>
    </div>
  );
};

export default CountDownTimer;
