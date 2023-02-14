import React from "react";
import "./Entrance.css";
import "animate.css";

const Entrance = () => {
  const randomNum = Math.floor(Math.random() * 3 + 1);
  setTimeout(() => {
    const entrance = document.getElementById("entrance");
    entrance.className = "animate__animated animate__fadeOut";
    setTimeout(() => {
      entrance.style.visibility = "hidden";
    }, 1000);
  }, 1000);
  console.log(randomNum);
  return (
    <div
      id="entrance"
      style={{
        display: "flex",
        justifyContent: "center",
        zIndex: 100,
        width: "100vw",
        height: "100vh",
        position: "absolute",
      }}>
      <img
        src={require(`../../assets/entrance${randomNum}.png`)}
        alt="entrance"
        style={{ height: "100vw" }}
      />
    </div>
  );
};

export default Entrance;
