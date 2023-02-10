import { React, useState, useEffect } from "react";
import axios from "axios";
import ReadyPage from "./ReadyPage";
import BanPage from "./BanPage";
import WaitOtherBanPage from "./WaitOtherBanPage";
import SelectedProblemPage from "./SelectedProblemPage";
import SolvingPage from "./SolvingPage";
import ResultPage from "./ResultPage";
import { useRecoilState } from "recoil";
import { selectedMode, selectedLanguage, matchingPlayerInfo } from "../../states/atoms";

let submitResult = "";

// const serverAddress = "localhost:3000";
const serverAddress = "i8b303.p.ssafy.io:9002";
const websocketAddress = "ws://" + serverAddress + "/websocket";
let socket = null;

const ContinuousBattlePage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isBanWait, setIsBanWait] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [problemNumber, setProblemNumber] = useState("-1");
  const [problems, setProblems] = useState([]);
  const [problemInfo, setProblemInfo] = useState([]);
  const idInfo = useRecoilState(matchingPlayerInfo);
  const battleModeInfo = useRecoilState(selectedMode);
  const languageMode = useRecoilState(selectedLanguage);
  console.log(languageMode);
  const [nickname, setNickname] = React.useState("a");
  const [speedTier, setSpeedTier] = React.useState("a");
  const [optTier, setOptTier] = React.useState("a");
  const [othernickname, setOtherNickname] = React.useState("b");
  const [otherspeedTier, setOtherSpeedTier] = React.useState("b");
  const [otheroptTier, setOtherOptTier] = React.useState("b");
  useEffect(() => {}, [nickname, speedTier, optTier]);
  useEffect(() => {}, [othernickname, otherspeedTier, otheroptTier]);

  const messageType = "connect";
  const userId = idInfo[0].userId;
  const otherId = idInfo[0].otherId;
  const hostCheck = idInfo[0].hostCheck;
  const battleMode = battleModeInfo[0];
  console.log(messageType, userId, otherId, hostCheck, battleMode);

  useEffect(() => {
    axios
      .post("http://i8b303.p.ssafy.io:8000/user-service/getUserInfo", {
        user_id: userId,
      })
      .then(function (response) {
        setNickname(response.data.nickname);
        setSpeedTier(response.data.speedTier);
        setOptTier(response.data.optimizationTier);
      })
      .catch((error) => {
        let customCode = error.response.data.custom_code;
        if (
          customCode === "100" ||
          customCode === "101" ||
          customCode === "102" ||
          customCode === "103" ||
          customCode === "104" ||
          customCode === "105"
        ) {
          // 로그인 실패 시 표시하는 내용
          alert(error.response.data.description);
        }
      });
    axios
      .post("http://i8b303.p.ssafy.io:8000/user-service/getUserInfo", {
        user_id: otherId,
      })
      .then(function (response) {
        setOtherNickname(response.data.nickname);
        setOtherSpeedTier(response.data.speedTier);
        setOtherOptTier(response.data.optimizationTier);
      })
      .catch((error) => {
        let customCode = error.response.data.custom_code;
        if (
          customCode === "100" ||
          customCode === "101" ||
          customCode === "102" ||
          customCode === "103" ||
          customCode === "104" ||
          customCode === "105"
        ) {
          // 로그인 실패 시 표시하는 내용
          alert(error.response.data.description);
        }
      });
  }, [userId, otherId]);

  socket = new WebSocket(websocketAddress);
  console.log("socket", socket);

  useEffect(() => {
    setTimeout(() => {
      socket.onopen = () =>
        setTimeout(
          socket.send(
            JSON.stringify({
              messageType: messageType,
              userId: userId,
              otherId: otherId,
              hostCheck: hostCheck,
              battleMode: battleMode,
            })
          ),
          2000
        );
    });
  }, [userId, otherId, hostCheck, battleMode]);

  useEffect(() => {
    return () => {
      console.log("배틀을 나가서 소켓 연결 끊김");
      socket.onclose();
    };
  }, []);

  socket.onmessage = (servermessage) => {
    console.log(servermessage);
    const data = JSON.parse(servermessage.data);
    if (data.messageType === "connect_success") {
      console.log("연결 완료!");
      console.log(data);
      socket.send(
        JSON.stringify({
          messageType: "getProblem",
          userId: userId,
          otherId: otherId,
        })
      );
    } else if (data.messageType === "ban_success") {
      console.log("문제 선택 완료!");
      setIsReady(false);
      setIsBanWait(true);
    } else if (data.messageType === "select_success") {
      setProblemInfo(data.problem);
      setTimeout(() => {
        setIsReady(false);
        setIsBanWait(false);
        setIsSelected(true);
        setTimeout(() => {
          setIsSelected(false);
          setIsSolving(true);
        }, 5000);
      }, 2000);
    } else if (data.messageType === "submit_success") {
      submitResult = data.submitResult;
      console.log(submitResult);
      if (submitResult === "success") {
        setIsSolved(true);
      }
    } else if (data.messageType === "closed") {
      socket.onclose();
    } else if (data.messageType === "sendProblem") {
      console.log(data.problems);
      const problems = data.problems;
      setProblems(problems);
      setTimeout(() => {
        setIsConnected(true);
        setIsReady(true);
      }, 3000);
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

  const changeBanProblem = (data) => {
    setProblemNumber(data);
    socket.send(
      JSON.stringify({
        messageType: "ban",
        userId: userId,
        otherId: otherId,
        problemNumber: data,
      })
    );
  };

  const goResultPage = () => {
    setIsSolving(false);
    setIsSolved(true);
    // socket.onclose();
  };

  return (
    <div>
      <div>
        {!isConnected && <ReadyPage />}
        {isConnected && isReady && (
          <BanPage
            props={problems}
            battleuserinfo={{
              user: { nick: nickname, speedTier: speedTier, optTier: optTier },
              other: { nick: othernickname, speedTier: otherspeedTier, optTier: otheroptTier },
            }}
            changeBanProblem={changeBanProblem}
          />
        )}
        {isConnected && isBanWait && <WaitOtherBanPage />}
        {isConnected && isSelected && (
          <SelectedProblemPage
            problemNumber={problemNumber}
            problemInfo={problemInfo}
            battleuserinfo={{
              user: { nick: nickname, speedTier: speedTier, optTier: optTier },
              other: { nick: othernickname, speedTier: otherspeedTier, optTier: otheroptTier },
            }}
          />
        )}
        {isConnected && isSolving && battleMode === "speed" && (
          <SolvingPage goResultPage={goResultPage} />
        )}
        {isConnected && isSolving && battleMode === "optimization" && (
          <SolvingPage goResultPage={goResultPage} />
        )}
        {isSolved && <ResultPage />}
      </div>
    </div>
  );
};

export default ContinuousBattlePage;
