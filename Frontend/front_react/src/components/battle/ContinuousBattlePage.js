import { React, useState } from "react";
import ReadyPage from "./ReadyPage";
import BanPage from "./BanPage";
import WaitOtherBanPage from "./WaitOtherBanPage";
import SelectedProblemPage from "./SelectedProblemPage";
import SolvingPage from "./SolvingPage";
import ResultPage from "./ResultPage";

let submitResult = "";

const usernamedata = "personA";
const personnamedata = "personB";
const serverAddress = "localhost:3000";
const websocketAddress = "ws://" + serverAddress + "/battle";
let socket = null;
console.log(usernamedata, personnamedata);

const ContinuousBattlePage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isBanWait, setIsBanWait] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [problemNumber, setProblemNumber] = useState("-1");

  window.onload = async function () {
    socket = new WebSocket(websocketAddress);
    console.log("socket", socket);
    socket.onopen = () => {
      const messageType = "connect";
      const username = usernamedata;
      const personname = personnamedata;
      const data = JSON.stringify({
        messageType: messageType,
        username: username,
        personname: personname,
      });
      socket.send(data);
    };

    socket.onmessage = (servermessage) => {
      const data = JSON.parse(servermessage);
      if (data.messageType === "connect_success") {
        console.log("연결 완료!");
        const personURL = data.personURL;
        console.log(personURL);
        setTimeout(() => {
          setIsConnected(true);
          setIsReady(true);
        }, 5000);
      } else if (data.messageType === "ban_success") {
        console.log("문제 선택 완료!");
        setTimeout(() => {
          setIsBanWait(true);
          setIsReady(false);
        }, 5000);
      } else if (data.messageType === "select_success") {
        setTimeout (() => {
          setIsBanWait(false);
          setIsSelected(true);
          setTimeout(() => {
            setIsSelected(false);
            setIsSolving(true);
          }, 15000);
        }, 5000);
      } else if (data.messageType === "submit_success") {
        submitResult = data.submitResult;
        console.log(submitResult);
        if (submitResult === "success") {
          setIsSolved(true);
        }
      } else if (data.messageType === "close") {
        socket.onclose();
      } else {
        console.log("뭐가 오긴 왔는데...");
        console.log(data);
      }
    };

    socket.onclose = (message) => {
      console.log("closed!", message);
    };
    socket.onerror = (message) => {
      console.log("error", message);
    };
  };

  const changeBanProblem = (data) => {
    setProblemNumber(data);
    // socket.send(JSON.stringify({ method: "ban", data: data }));
    setIsReady(false)
    setIsBanWait(true)
    setTimeout(() => {
        setIsBanWait(false)
        setIsSelected(true)
    }, 10000)
  };

  //확인용 함수들
  const changeConnectTrue = () => {
    setTimeout(() => {
      setIsConnected(true);
      setIsReady(true);
    }, 5000);
  };
  const changeSelectedTrue = () => {
    setTimeout(() => {
      setIsSelected(true);
      setIsReady(false);
    }, 5000);
  };
  const changeSolvedTrue = () => {
    setTimeout(() => {
      setIsSolved(true);
      setIsSelected(false);
    }, 5000);
  };
  return (
    <div>
      <div>
        <button onClick={changeConnectTrue}>connect</button>
        <button onClick={changeSelectedTrue}>banselect</button>
        <button>submit_resultfail</button>
        <button onClick={changeSolvedTrue}>submit_resultsuccess</button>
        {!isConnected && <ReadyPage />}
        {isReady && <BanPage changeBanProblem={changeBanProblem} />} 
        {isBanWait && <WaitOtherBanPage />}
        {isSelected && <SelectedProblemPage problemnumber={problemNumber} />}
        {isSolving && <SolvingPage />}
        {isSolved && <ResultPage />}
      </div>
    </div>
  );
};

export default ContinuousBattlePage;
