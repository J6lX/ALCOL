import React from "react";
import "animate.css";

const Entrance = () => {
  const randomNum = Math.floor(Math.random() * 3 + 1);
  console.log(randomNum);
  return (
    <div className="animate__animated animate__fadeOut" style={{ zIndex: 100 }}>
      <img
        src={`../../assets/entrance${randomNum}.png`}
        alt="entrance"
        style={{ width: "100vw", height: "100vh" }}
      />
    </div>
  );
};

export default Entrance;
