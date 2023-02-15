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
      }, 700);
    }, 700);
    return (
      <div
        id="entrance"
        style={{
          position: "fixed",
          display: "flex",
          justifyContent: "center",
          zIndex: 100,
          width: "100vw",
          height: "100vh",
        }}>
        <img
          src={require(`../../assets/entrance${randomNum}.png`)}
          alt="entrance"
          style={{ width: "150vw", height: "100vh" }}
        />
      </div>
    );
  }

export default Entrance;
