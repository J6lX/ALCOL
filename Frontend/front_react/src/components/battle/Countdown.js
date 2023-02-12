import React from 'react';
import countDown from "../assets/count_down.mp4";

const Countdown = () => {
    return (
        <div>
            <video src={countDown} autoPlay muted style={{ width: "100vw", height: "100vh" }}></video>
        </div>
    );
};

export default Countdown;