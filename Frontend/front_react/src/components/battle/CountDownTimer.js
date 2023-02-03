import React from "react";

const CountDownTimer = () => {
  const [[mins, secs], setTime] = React.useState([5, 0]);

  const tick = () => {
    if (mins === 0 && secs === 0) {
    } else if (secs === 0) {
      setTime([mins - 1, 59]);
    } else {
      setTime([mins, secs - 1]);
    }
  };

  React.useEffect(() => {
    //1초
    const timerId = setInterval(() => tick(), 1000);
    return () => clearInterval(timerId);
  });

  return (
    <div>
      <p style={{ textAlign: "center", color: "white" }}>{`${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`}</p>
    </div>
  );
};

export default CountDownTimer;
