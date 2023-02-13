import { React, useState, useEffect } from "react";
import axios from "axios";
import $ from "jquery";
import ReadyPage from "./ReadyPage";
import BanPage from "./BanPage";
import WaitOtherBanPage from "./WaitOtherBanPage";
import SelectedProblemPage from "./SelectedProblemPage";
import SolvingPage from "./SolvingPage";
import SolvingOptPage from "./SolvingOptPage";
import ResultPage from "./ResultPage";
import { useRecoilState, useRecoilValue } from "recoil";
import { message, Modal } from "antd";
import {
  selectedMode,
  selectedLanguage,
  matchingPlayerInfo,
  resultListResultInfo,
} from "../../states/atoms";

// let submitResult = "";
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
  // const [problemNumber, setProblemNumber] = useState("-1");
  const [problems, setProblems] = useState([]);
  const [problemInfo, setProblemInfo] = useState([]);
  const [resultListResult, setResultListResult] = useRecoilState(resultListResultInfo);
  const idInfo = useRecoilValue(matchingPlayerInfo);
  const battleModeInfo = useRecoilValue(selectedMode);
  const languageMode = useRecoilValue(selectedLanguage);
  // let problems;
  console.log(languageMode);
  const [nickname, setNickname] = useState("a");
  const [speedTier, setSpeedTier] = useState("a");
  const [optTier, setOptTier] = useState("a");
  const [othernickname, setOtherNickname] = useState("b");
  const [otherspeedTier, setOtherSpeedTier] = useState("b");
  const [otheroptTier, setOtherOptTier] = useState("b");
  useEffect(() => {}, [nickname, speedTier, optTier]);
  useEffect(() => {}, [othernickname, otherspeedTier, otheroptTier]);

  console.log(problems);

  const messageType = "connect";
  const userId = idInfo.userId;
  const otherId = idInfo.otherId;
  const hostCheck = idInfo.hostCheck;
  const battleMode = battleModeInfo;
  console.log(messageType, userId, otherId, hostCheck, battleMode);

  // let score = ""

  useEffect(() => {
    axios
      .post("http://i8b303.p.ssafy.io:8000/user-service/getUserInfo", {
        user_id: userId,
      })
      .then(function (response) {
        console.log("내 정보 가져오기 axios 날림");
        setNickname(response.data.nickname);
        setSpeedTier(response.data.speed_tier);
        setOptTier(response.data.optimization_tier);
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
        console.log("상대 정보 가져오기 axios 날림");
        setOtherNickname(response.data.nickname);
        setOtherSpeedTier(response.data.speed_tier);
        setOtherOptTier(response.data.optimization_tier);
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

  if (isConnected === false && nickname !== "a" && othernickname !== "b") {
    socket = new WebSocket(websocketAddress);
    console.log("socket", socket);

    socket.onopen = () => {
      setTimeout(() => {
        console.log("여길 봐", userId, otherId, hostCheck, battleMode);
        socket.send(
          JSON.stringify({
            messageType: messageType,
            userId: userId,
            otherId: otherId,
            hostCheck: hostCheck,
            battleMode: battleMode,
          })
        );
      }, 500);
    };

    socket.onmessage = (servermessage) => {
      console.log(servermessage);
      const data = JSON.parse(servermessage.data);
      if (data.messageType === "connect_success") {
        console.log("연결 완료!");
        console.log(data);
        setTimeout(() => {
          socket.send(
            JSON.stringify({
              messageType: "getProblem",
              userId: userId,
              otherId: otherId,
            })
          );
        }, 300);
        setIsConnected(true);
      } else if (data.messageType === "ban_success") {
        console.log("문제 선택 완료!");
        setTimeout(() => {
          setIsReady(false);
          setIsBanWait(true);
        }, 500);
      } else if (data.messageType === "select_success") {
        console.log("이게 날라왔어", data.problem);
        setTimeout(() => {
          setProblemInfo(data.problem);
          setTimeout(() => {
            setIsReady(false);
            setIsBanWait(false);
            setIsSelected(true);
            setTimeout(() => {
              socket.send(
                JSON.stringify({
                  messageType: "battleStart",
                  userId: userId,
                  otherId: otherId,
                })
              );
              setIsSelected(false);
              setIsSolving(true);
            }, 10000);
          }, 1000);
        }, 1000);
      } else if (data.messageType === "closed") {
        socket.close();
      } else if (data.messageType === "sendProblem") {
        console.log(data.problems);
        const problems = data.problems;
        setProblems(problems);
        setTimeout(() => {
          setIsConnected(true);
          setIsReady(true);
        }, 300);
      } else if (data.messageType === "exitResultOk") {
        const modaldata = {
          title: "배틀 종료 제안 수락!",
          content: (
            <div>
              <p>배틀 종료 제안이 수락되었습니다.</p>
              <p>확인을 누르시면 배틀이 종료됩니다.</p>
            </div>
          ),
          okText: "확인",
          onOk() {
            socket.send(
              JSON.stringify({
                messageType: "finish",
                userId: userId,
                otherId: otherId,
              })
            );
          },
        };
        info(modaldata);
      } else if (data.messageType === "exitResultNo") {
        const modaldata = {
          title: "시간이 더 필요해요...",
          content: (
            <div>
              <p>상대방이 조금 더 시간이 필요한가 봅니다...</p>
              <p>조금만 기다려주세요!</p>
              <small>잠시 기다리시면서 코드를 한 번 더 살펴보는 건 어떨까요?</small>
              <small>더 효율적인 방법이 떠오를지도 몰라요!</small>
            </div>
          ),
          okText: "확인",
          onOk() {},
        };
        info(modaldata);
      } else if (data.messageType === "exitSuggestion") {
        showModal();
      } else if (data.messageType === "submitResult") {
        if (battleMode === "speed") {
          const result = {
            mode: battleMode,
            language: languageMode,
            result: `${data.accepted} / ${data.testcase}`,
            time: data.time,
            memory: data.memory,
          };
          let resultList = resultListResult;
          resultList.push(result);
          const modaldata = {
            title: "오답!",
            content: (
              <div>
                <p>틀렸습니다!</p>
                <p>테스트케이스를 모두 맞추지 못했습니다.</p>
                <p>
                  {data.accepted} / {data.testcase}
                </p>
                <p>그러나 {othernickname} 님은 긴장하고 있겠군요.</p>
                <small>제출을 하면 상대방에게 소식이 전달됩니다.</small>
              </div>
            ),
            okText: "확인",
            onOk() {},
          };
          info(modaldata);
          setResultListResult(resultList);
        } // 최적화전이면 정답, 오답만 나눠서 atom에 저장
        // const result = {
        //   mode: battleMode,
        //   language: languageMode,
        //   result: "accepted",
        //   time: data.time,
        //   memory: data.memory,
        // }
        // let resultList = resultListResult
        // resultList.push(result)
        // setResultListResult(resultList)

        // if (data.result === "correct") {
        //   const modaldata = {
        //     title: "정답!",
        //     content: (
        //       <div>
        //         <p>축하합니다!</p>
        //         <p>모든 테스트케이스를 맞췄습니다!</p>
        //         {battleMode === "speed" && <p>승리를 거머쥔 {nickname} 님!!</p>}
        //         {battleMode === "speed" && <small>확인 버튼을 누르시면 배틀을 종료합니다!</small>}
        //         {battleMode === "optimization" && <p>빠르게 나아가는 {nickname} 님!!</p>}
        //         {battleMode === "optimization" && <small>과연 더 효율적인 코드가 나올 수 있을까요??</small>}
        //       </div>
        //     ),
        //     okText: "확인",
        //     onOk() {
        //       if (battleMode === "speed") {
        //         socket.send(
        //           JSON.stringify({
        //           messageType: "finish",
        //           userId: userId,
        //           otherId: otherId
        //           })
        //         )
        //         setIsSolved(true);
        //       } else if (battleMode === "optimization") {
        //       }
        //     },
        //   }
        //   info(modaldata)
        // } else if (data.result === "fail") {
        //   const modaldata = {
        //     title: "오답!",
        //     content: (
        //       <div>
        //         <p>틀렸습니다!</p>
        //         <p>테스트케이스를 모두 맞추지 못했습니다.</p>
        //         <p>그러나 {othernickname} 님은 긴장하고 있겠군요.</p>
        //         <small>제출을 하면 상대방에게 소식이 전달됩니다.</small>
        //       </div>
        //     ),
        //     okText: "확인",
        //     onOk() {},
        //   }
        //   info(modaldata)
        // }
      } else if (data.messageType === "otherSubmitResult") {
        submitOther(data.testcase, data.accepted);
      } else if (data.messageType === "timeout") {
        const modaldata = {
          title: "배틀 시간 초과!",
          content: (
            <div>
              <p>배틀 시간이 종료되었습니다.</p>
              <p>확인을 누르시면 배틀이 종료됩니다.</p>
            </div>
          ),
          okText: "확인",
          onOk() {
            socket.send(
              JSON.stringify({
                messageType: "finish",
                userId: userId,
                otherId: otherId,
              })
            );
            setIsSolved(true);
          },
        };
        info(modaldata);
      } else if (data.messageType === "error") {
        showSocketErrorModal();
      } else if (data.messageType === "surrender") {
        showOppSurrenderModal();
      } else if (data.messageType === "battleResult") {
        if (data.battleMode === "speed") {
          if (data.battleResult === "win") {
            console.log(data);
            const modaldata = {
              title: "정답!",
              content: (
                <div>
                  <p>축하합니다!</p>
                  <p>모든 테스트케이스를 맞췄습니다!</p>
                  {battleMode === "speed" && <p>승리를 거머쥔 {nickname} 님!!</p>}
                  {battleMode === "speed" && <small>확인 버튼을 누르시면 배틀을 종료합니다!</small>}
                </div>
              ),
              okText: "확인",
              onOk() {
                if (battleMode === "speed") {
                  const result = {
                    mode: battleMode,
                    language: languageMode,
                    result: "accepted",
                    time: data.time,
                    memory: data.memory,
                  };
                  let resultList = resultListResult;
                  resultList.push(result);
                  setResultListResult(resultList);
                  setIsSolving(false);
                  setIsSolved(true);
                }
              },
            };
            info(modaldata);
          } else if (data.battleResult === "lose") {
            showOppSubmitModal();
          }
        } else if (battleMode === "optimization") {
          if (data.battleResult === "win") {
            console.log(data);
            const modaldata = {
              title: "승리!",
              content: (
                <div>
                  <p>축하합니다!</p>
                  <p>승리했습니다!</p>
                  <p>승리를 거머쥔 {nickname} 님!!</p>
                  <small>확인 버튼을 누르시면 배틀을 종료합니다!</small>
                </div>
              ),
              okText: "확인",
              onOk() {
                setIsSolving(false);
                setIsSolved(true);
              },
            };
            info(modaldata);
          } else if (data.battleResult === "lose") {
            showOppSubmitModal();
          }
        }
      } else {
        console.log("뭐가 오긴 왔는데...");
        console.log(data);
      }
    };

    socket.onclose = (message) => {
      console.log("closed!", message);
      // setTimeout(() => {
      //   isConnected(false)
      // }, 100)
    };
    socket.onSocketerror = (message) => {
      console.log("Socketerror", message);
    };
  }

  // 배틀 종료 제안이 왔을 때
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    socket.send(
      JSON.stringify({
        messageType: "exitOk",
        userId: userId,
        otherId: otherId,
      })
    );
    setIsModalOpen(false);
    setIsSolved(true);
  };
  const handleCancel = () => {
    socket.send(
      JSON.stringify({
        messageType: "exitNo",
        userId: userId,
        otherId: otherId,
      })
    );
    setIsModalOpen(false);
  };

  const [isOppSubmitModalOpen, setIsOppSubmitModalOpen] = useState(false);
  const showOppSubmitModal = () => {
    setIsOppSubmitModalOpen(true);
  };
  const oppSubmitHandleOk = () => {
    socket.send(
      JSON.stringify({
        messageType: "finish",
        userId: userId,
        otherId: otherId,
      })
    );
    setIsOppSubmitModalOpen(false);
    setIsSolving(false);
    setIsSolved(true);
  };

  const [isSurrenderModalOpen, setIsSurrenderModalOpen] = useState(false);
  const showSurrenderModal = () => {
    setIsSurrenderModalOpen(true);
  };
  const surrenderHandleOk = () => {
    socket.send(
      JSON.stringify({
        messageType: "surrender",
        userId: userId,
        otherId: otherId,
      })
    );
    setIsSurrenderModalOpen(false);
  };
  const surrenderHandleCancel = () => {
    setIsSurrenderModalOpen(false);
  };

  const [isOppSurrenderModalOpen, setIsOppSurrenderModalOpen] = useState(false);
  const showOppSurrenderModal = () => {
    setIsOppSurrenderModalOpen(true);
  };
  const oppSurrenderHandleOk = () => {
    socket.send(
      JSON.stringify({
        messageType: "finish",
        userId: userId,
        otherId: otherId,
      })
    );
    setIsOppSurrenderModalOpen(false);
  };

  const [isSocketErrorModalOpen, setIsSocketErrorModalOpen] = useState(false);
  const showSocketErrorModal = () => {
    setIsSocketErrorModalOpen(true);
  };
  const socketErrorHandleOk = () => {
    socket.send(
      JSON.stringify({
        messageType: "finish",
        userId: userId,
        otherId: otherId,
      })
    );
    setIsSocketErrorModalOpen(false);
  };

  const [messageApi, contextHolder] = message.useMessage();
  const submitOther = (testcase, accepted) => {
    messageApi.open({
      type: "warning",
      content: `${othernickname}님이 코드를 제출했습니다. (테스트케이스 ${testcase}개 중 ${accepted}개 정답)`,
      duration: 3,
      style: { marginTop: "5.5vh" },
    });
  };

  const [messageCopyApi, contextCopyHolder] = message.useMessage();
  const copySuccess = () => {
    messageCopyApi.open({
      type: "warning",
      content: "코드 복사 완료!",
      duration: 3,
      style: { marginTop: "2vh" },
    });
  };

  const info = (data) => {
    Modal.info(data);
  };

  $(function () {
    $("#test").on("paste", function () {
      const data = {
        title: "복사나 붙여넣기 불가!",
        content: (
          <div>
            <p>배틀의 공평한 진행을 위해서</p>
            <p>복사나 붙여넣기는 불가능합니다!</p>
            <p>코드를 직접 타이핑해주세요.</p>
          </div>
        ),
        okText: "확인",
        onOk() {},
      };
      info(data);
      return false;
    });
  });

  $(function () {
    $("#test").on("copy", function () {
      const data = {
        title: "복사 붙여넣기 불가!",
        content: (
          <div>
            <p>배틀의 공평한 진행을 위해서</p>
            <p>복사나 붙여넣기는 불가능합니다!</p>
            <p>코드를 직접 타이핑해주세요.</p>
          </div>
        ),
        okText: "확인",
        onOk() {},
      };
      info(data);
      return false;
    });
  });

  const changeBanProblem = (data) => {
    // setProblemNumber(data);
    socket.send(
      JSON.stringify({
        messageType: "ban",
        userId: userId,
        otherId: otherId,
        problemNumber: data,
      })
    );
  };

  const submit = (codedata, problemNumber) => {
    console.log(battleModeInfo, languageMode, problemNumber, codedata);
    socket.send(
      JSON.stringify({
        messageType: "submit",
        userId: userId,
        otherId: otherId,
        mode: battleModeInfo[0],
        language: languageMode[0],
        problemNumber: problemNumber,
        code: codedata,
      })
    );
  };

  const sendExit = () => {
    socket.send(
      JSON.stringify({
        messageType: "exitSuggestion",
        userId: userId,
        otherId: otherId,
      })
    );
  };

  const clickSurrender = () => {
    showSurrenderModal();
  };

  const copyCode = () => {
    const codetext = document.getElementById("IDE");
    codetext.select();
    document.execCommand("copy");
    copySuccess();
  };

  return (
    <div>
      <div>
        {contextHolder}
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
            problems={problems}
            problemInfo={problemInfo}
            battleMode={battleModeInfo}
            battleLanguage={languageMode}
            battleuserinfo={{
              user: { nick: nickname, speedTier: speedTier, optTier: optTier },
              other: { nick: othernickname, speedTier: otherspeedTier, optTier: otheroptTier },
            }}
          />
        )}
        {isConnected && isSolving && battleMode === "speed" && (
          <SolvingPage
            problemInfo={problemInfo}
            battleMode={battleModeInfo}
            battleLanguage={languageMode}
            battleuserinfo={{
              user: { nick: nickname, speedTier: speedTier, optTier: optTier },
              other: { nick: othernickname, speedTier: otherspeedTier, optTier: otheroptTier },
            }}
            submit={submit}
            clickSurrender={clickSurrender}
          />
        )}
        {isConnected && isSolving && battleMode === "optimization" && (
          <SolvingOptPage
            problemInfo={problemInfo}
            battleMode={battleModeInfo}
            battleLanguage={languageMode}
            battleuserinfo={{
              user: { nick: nickname, speedTier: speedTier, optTier: optTier },
              other: { nick: othernickname, speedTier: otherspeedTier, optTier: otheroptTier },
            }}
            submit={submit}
            sendExit={sendExit}
            clickSurrender={clickSurrender}
          />
        )}
        {isSolved && <ResultPage />}
      </div>
      <Modal
        title="배틀 종료 제안"
        open={isModalOpen}
        onOk={handleOk}
        okText="네"
        onCancel={handleCancel}
        cancelText="아니오">
        <p>{othernickname}님이 배틀을 끝내자고 요청하셨습니다.</p>
        <p>배틀을 끝내시겠습니까?</p>
        <small>'네'를 누르면 배틀이 종료됩니다.</small>
        <small>지금 끝내고 싶지 않으시면 '아니오'를 눌러주세요.</small>
      </Modal>
      <Modal
        title={`${othernickname}의 네트워크 오류`}
        open={isSocketErrorModalOpen}
        onOk={socketErrorHandleOk}
        okText="확인"
        onCancel={copyCode}
        cancelText="코드 복사"
        closable="false">
        {contextCopyHolder}
        <p>상대방 "{othernickname} 님"의 인터넷 연결이 이상합니다.</p>
        <p>지금까지 쓴 코드를 클립보드에 복사하려면 코드 복사 버튼을 누르세요!</p>
        <p>확인을 누르시면 배틀이 종료됩니다.</p>
      </Modal>
      <Modal
        title="패배..."
        open={isOppSubmitModalOpen}
        onOk={oppSubmitHandleOk}
        okText="확인"
        onCancel={copyCode}
        cancelText="코드 복사"
        closable="false">
        {contextCopyHolder}
        {battleMode === "speed" && <p>상대방 "{othernickname} 님"이 먼저 문제를 풀었습니다.</p>}
        {battleMode === "optimiztion" && (
          <p>상대방 "{othernickname} 님"이 더 효율적으로 풀었습니다.</p>
        )}
        <p>지금까지 쓴 코드를 클립보드에 복사하려면 코드 복사 버튼을 누르세요!</p>
        <p>확인을 누르시면 배틀이 종료됩니다.</p>
      </Modal>
      <Modal
        title={`${othernickname} 님의 항복 선언!`}
        open={isOppSurrenderModalOpen}
        onOk={oppSurrenderHandleOk}
        okText="확인"
        onCancel={copyCode}
        cancelText="코드 복사"
        closable="false">
        {contextCopyHolder}
        <p>상대방 "{othernickname} 님"이 항복을 선언했습니다.</p>
        <p>지금까지 쓴 코드를 클립보드에 복사하려면 코드 복사 버튼을 누르세요!</p>
        <p>확인을 누르시면 배틀이 종료됩니다.</p>
      </Modal>
      <Modal
        title="항복"
        open={isSurrenderModalOpen}
        onOk={surrenderHandleOk}
        onCancel={surrenderHandleCancel}>
        <p className="NanumSquare">정말로 항복하시겠습니까?</p>
      </Modal>
    </div>
  );
};

export default ContinuousBattlePage;
