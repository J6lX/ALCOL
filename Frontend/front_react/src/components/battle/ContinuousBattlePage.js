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
import ResultListPage from "./ResultListPage";
import { useRecoilState, useRecoilValue } from "recoil";
import { message, Modal, Spin } from "antd";
import {
  selectedMode,
  selectedLanguage,
  matchingPlayerInfo,
  resultListResultInfo,
  sendConnect,
  sendGetProblem,
  sendBattleStart,
} from "../../states/atoms";

// let submitResult = "";
const serverAddress = "i8b303.p.ssafy.io:9002";
const websocketAddress = "ws://" + serverAddress + "/websocket";
let socket = null;
let code = "";

function sleep(ms, func) {
  return new Promise((r) => {
    func();
    setTimeout(r, ms);
  });
}

const ContinuousBattlePage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isBanWait, setIsBanWait] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  // const [problemNumber, setProblemNumber] = useState("-1");
  const [problems, setProblems] = useState([]);
  const [problemInfo, setProblemInfo] = useState([]);
  const [battleResult, setBattleResult] = useState([]);
  const [resultListResult, setResultListResult] = useRecoilState(resultListResultInfo);
  const [checkConnect, setCheckConnect] = useRecoilState(sendConnect);
  const [checkGetProblem, setCheckGetProblem] = useRecoilState(sendGetProblem);
  const [checkBattleStart, setCheckBattleStart] = useRecoilState(sendBattleStart);
  // const code = useRecoilValue(userCode);
  const idInfo = useRecoilValue(matchingPlayerInfo);
  const battleModeInfo = useRecoilValue(selectedMode);
  const languageMode = useRecoilValue(selectedLanguage);

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

  if (isConnected === false && checkConnect === "-1" && nickname !== "a" && othernickname !== "b") {
    socket = new WebSocket(websocketAddress);
    console.log("socket", socket);

    socket.onopen = () => {
      if (checkConnect === "-1") {
        console.log("소켓이 오픈되었습니다. 아래 데이터를 보냅니다.");
        console.log(messageType, userId, otherId, hostCheck, battleMode);
        sleep(500, () => {
          setCheckConnect("0");
        }).then(() => {
          console.log("connect보낸다");
          socket.send(
            JSON.stringify({
              messageType: messageType,
              userId: userId,
              otherId: otherId,
              hostCheck: hostCheck,
              battleMode: battleMode,
            })
          );
        });
      }
    };

    socket.onmessage = (servermessage) => {
      console.log("서버에서 메세지를 받았습니다.", servermessage);
      const data = JSON.parse(servermessage.data);
      if (data.messageType === "connect_success") {
        console.log("연결 완료! 아래와 같은 데이터를 받았습니다.");
        console.log(data);
        if (checkGetProblem === "-1") {
          sleep(500, () => {
            setCheckGetProblem("0");
          }).then(() => {
            console.log("getProblem보낸다");
            socket.send(
              JSON.stringify({
                messageType: "getProblem",
                userId: userId,
                otherId: otherId,
              })
            );
          });
        }
        sleep(500, () => {
          setIsConnected(true);
        });
      } else if (data.messageType === "ban_success") {
        console.log("문제 밴 완료! 아래의 데이터를 받았습니다.");
        console.log(data);
        setTimeout(() => {
          setIsReady(false);
          setIsBanWait(true);
        }, 300);
      } else if (data.messageType === "select_success") {
        console.log("배틀에서 풀 문제 세부 정보를 받았습니다.", data.problem);
        setTimeout(() => {
          setProblemInfo(data.problem);
          setTimeout(() => {
            setIsReady(false);
            setIsBanWait(false);
            setIsSelected(true);
            setTimeout(() => {
              console.log("");
            }, 1000);
            setTimeout(() => {
              if (checkBattleStart === "-1") {
                sleep(500, () => {
                  setCheckBattleStart("0");
                }).then(() => {
                  console.log("battleStart 보낸다");
                  socket.send(
                    JSON.stringify({
                      messageType: "battleStart",
                      userId: userId,
                      otherId: otherId,
                    })
                  );
                  setIsSelected(false);
                  setIsSolving(true);
                });
              }
            }, 10000);
          }, 1000);
        }, 1000);
      } else if (data.messageType === "closed") {
        socket.close();
      } else if (data.messageType === "sendProblem") {
        console.log("밴할 문제 세 개를 받았습니다.");
        console.log(data.problems);
        const problemsdata = [data.problems];
        setProblems(problemsdata);
        setTimeout(() => {
          setIsConnected(true);
          setIsReady(true);
        }, 30);
        setTimeout(() => {
          console.log("");
        }, 300);
      } else if (data.messageType === "exitResultOk") {
        showSuggestionOkModal();
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
        toggleSpin(false);
        if (battleMode === "speed") {
          const result = {
            nick: nickname,
            mode: battleMode,
            language: languageMode,
            result: `${data.accepted} / ${data.testcase}`,
            time: data.time,
            memory: data.memory,
          };
          let resultList = [...resultListResult];
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
        const result = {
          nick: othernickname,
          mode: battleMode,
          language: languageMode,
          result: `${data.accepted} / ${data.testcase}`,
          time: data.time,
          memory: data.memory,
        };
        let resultList = [...resultListResult];
        resultList.push(result);
        submitOther(data.testcase, data.accepted);
        setResultListResult(resultList);
      } else if (data.messageType === "timeout") {
        showTimeOutModal();
      } else if (data.messageType === "error") {
        showSocketErrorModal();
      } else if (data.messageType === "surrender") {
        showOppSurrenderModal();
      } else if (data.messageType === "battleResult") {
        toggleSpin(false);
        if (battleMode === "speed") {
          setBattleResult(data);
          if (data.battleResult === "win") {
            showSpeedWinModal();
            console.log(data);
            const result = {
              nick: nickname,
              mode: battleMode,
              language: languageMode,
              result: "accepted",
              time: data.time,
              memory: data.memory,
            };
            let resultList = [...resultListResult];
            resultList.push(result);
            setResultListResult(resultList);
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

    console.log("배틀 결과 보이니", battleResult);

    socket.onclose = (message) => {
      console.log("closed!", message);
    };
    socket.onSocketerror = (message) => {
      console.log("Socketerror", message);
    };
  }

  // 배틀 종료 제안할 때
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const showSuggestionModal = () => {
    setIsSuggestionModalOpen(true);
  };
  const suggestionHandleOk = () => {
    socket.send(
      JSON.stringify({
        messageType: "exitSuggestion",
        userId: userId,
        otherId: otherId,
      })
    );
    setIsSuggestionModalOpen(false);
    setIsSolved(true);
  };
  const suggestionHandleCancel = () => {
    setIsSuggestionModalOpen(false);
  };

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
    showFinishModal();
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

  // 상대방이 배틀 종료를 수락했을 때
  const [isSuggestionOkModalOpen, setIsSuggestionOkModalOpen] = useState(false);
  const showSuggestionOkModal = () => {
    setIsSuggestionOkModalOpen(true);
  };
  const suggestionOkHandleOk = () => {
    socket.send(
      JSON.stringify({
        messageType: "finish",
        userId: userId,
        otherId: otherId,
      })
    );
    setIsSuggestionOkModalOpen(false);
    setIsSolving(false);
    setIsSolved(true);
  };

  // 상대방이 배틀 종료를 수락했을 때
  const [speedWinModalOpen, setSpeedWinModalOpen] = useState(false);
  const showSpeedWinModal = () => {
    setSpeedWinModalOpen(true);
  };
  const speedWinHandleOk = () => {
    socket.send(
      JSON.stringify({
        messageType: "finish",
        userId: userId,
        otherId: otherId,
      })
    );
    setSpeedWinModalOpen(false);
    setIsSolving(false);
    setIsSolved(true);
  };

  setIsSolving(false);
  setIsSolved(true);

  // 배틀 종료 시
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const showFinishModal = () => {
    setIsFinishModalOpen(true);
  };
  const finishHandleOk = () => {
    setIsFinishModalOpen(false);
    setIsSolving(false);
    setIsSolved(true);
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

  const [isTimeOutModalOpen, setIsTimeOutModalOpen] = useState(false);
  const showTimeOutModal = () => {
    setIsTimeOutModalOpen(true);
  };
  const timeOutHandleOk = () => {
    socket.send(
      JSON.stringify({
        messageType: "finish",
        userId: userId,
        otherId: otherId,
      })
    );
    setIsTimeOutModalOpen(false);
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
        mode: battleMode,
        language: languageMode,
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
    if (data === "timeout") {
      console.log("timeout");
      // socket.send(
      //   JSON.stringify({
      //     messageType: "banTimeout",
      //     userId: userId,
      //     otherId: otherId,
      //     problemNumber: data,
      //   })
      // );
    }
    // setProblemNumber(data);
    if (isBanWait === false) {
      console.log("ban 날린다");
      socket.send(
        JSON.stringify({
          messageType: "ban",
          userId: userId,
          otherId: otherId,
          problemNumber: data,
        })
      );
    }
    setTimeout(() => {
      console.log("");
    }, 300);
  };

  const [isSpin, setIsSpin] = useState(false);
  const toggleSpin = (data) => {
    setIsSpin(data);
  };

  const submit = (codedata, problemNumber) => {
    console.log(battleModeInfo, languageMode, problemNumber, codedata);
    toggleSpin(true);
    socket.send(
      JSON.stringify({
        messageType: "submit",
        userId: userId,
        otherId: otherId,
        mode: battleModeInfo,
        language: languageMode,
        problemNumber: problemNumber,
        code: codedata,
      })
    );
  };

  const sendExit = () => {
    showSuggestionModal();
  };

  const clickSurrender = () => {
    showSurrenderModal();
  };

  const codeEmit = (codedata) => {
    code = codedata;
  };

  const copyCode = () => {
    const element = document.createElement("textarea");
    element.value = code;
    console.log(element);
    console.log(code);
    element.setAttribute("readonly", "");
    element.style.position = "absolute";
    element.style.left = "-9999px";
    document.body.appendChild(element);
    element.select();
    document.execCommand("copy");
    document.body.removeChild(element);
    copySuccess();
  };

  const showDetailResult = () => {
    setIsSolved(false);
    setIsOpenDetail(true);
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
        <Spin spinning={isSpin}>
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
              codeEmit={codeEmit}
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
        </Spin>
        {isSolved && <ResultPage props={battleResult} showDetailResult={showDetailResult} />}
        {isOpenDetail && (
          <ResultListPage
            problemInfo={problemInfo}
            battleMode={battleModeInfo}
            battleLanguage={languageMode}
            battleuserinfo={{
              user: { nick: nickname, speedTier: speedTier, optTier: optTier },
              other: { nick: othernickname, speedTier: otherspeedTier, optTier: otheroptTier },
            }}
          />
        )}
      </div>
      <Modal
        title="배틀을 종료하자고 제안하시겠습니까?"
        open={isSuggestionModalOpen}
        onOk={suggestionHandleOk}
        okText="네"
        onCancel={suggestionHandleCancel}
        cancelText="취소">
        <p>상대방의 동의를 얻으면 배틀을 종료할 수 있습니다.</p>
        <p>배틀 종료를 제안한 후, 상대방의 응답까지 시간이 조금 걸릴 수 있습니다.</p>
        <small>'네'를 누르면 {othernickname} 님에게 배틀 종료 제안이 전달됩니다.</small>
      </Modal>
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
        title="배틀 종료!!"
        open={isFinishModalOpen}
        onOk={finishHandleOk}
        okText="확인"
        onCancel={copyCode}
        cancelText="복사하기">
        <p>오늘도 즐거운 알고리즘 배틀하셨나요?</p>
        <p>코드를 복사하고 싶다면 복사하기 버튼을 눌러주세요!</p>
        <small>'확인'을 누르면 배틀 결과를 확인할 수 있습니다.</small>
      </Modal>
      <Modal
        title="배틀 종료 제안 수락!"
        open={isSuggestionOkModalOpen}
        onOk={suggestionOkHandleOk}
        okText="확인"
        onCancel={copyCode}
        cancelText="복사하기">
        <p>배틀 종료 제안이 수락되었습니다.</p>
        <p>확인을 누르시면 배틀이 종료됩니다.</p>
        <p>코드를 복사하고 싶다면 복사하기 버튼을 눌러주세요!</p>
      </Modal>
      <Modal
        title="정답!"
        open={speedWinModalOpen}
        onOk={speedWinHandleOk}
        okText="확인"
        onCancel={copyCode}
        cancelText="복사하기">
        <p>축하합니다!</p>
        <p>모든 테스트케이스를 맞췄습니다!</p>
        <p>승리를 거머쥔 {nickname} 님!!</p>
        <p>코드를 복사하고 싶다면 복사하기 버튼을 눌러주세요!</p>
        <small>확인 버튼을 누르시면 배틀을 종료합니다!</small>
      </Modal>
      <Modal
        title={`${othernickname}의 네트워크 오류`}
        open={isSocketErrorModalOpen}
        onOk={socketErrorHandleOk}
        okText="확인"
        onCancel={copyCode}
        cancelText="코드 복사"
        closable={false}>
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
        closable={false}>
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
        closable={false}>
        {contextCopyHolder}
        <p>상대방 "{othernickname} 님"이 항복을 선언했습니다.</p>
        <p>지금까지 쓴 코드를 클립보드에 복사하려면 코드 복사 버튼을 누르세요!</p>
        <p>확인을 누르시면 배틀이 종료됩니다.</p>
      </Modal>
      <Modal
        title="항복"
        open={isSurrenderModalOpen}
        onOk={surrenderHandleOk}
        okText="항복"
        onCancel={surrenderHandleCancel}
        cancelText="취소">
        <p className="NanumSquare">정말로 항복하시겠습니까?</p>
        <p className="NanumSquare">항복하시면 배틀이 종료됩니다.</p>
      </Modal>
      <Modal
        title="배틀 시간 초과..."
        open={isTimeOutModalOpen}
        onOk={timeOutHandleOk}
        okText="확인"
        onCancel={copyCode}
        cancelText="코드 복사"
        closable={false}>
        {contextCopyHolder}
        <p>배틀 시간이 초과되었습니다.</p>
        <p>지금까지 쓴 코드를 클립보드에 복사하려면 코드 복사 버튼을 누르세요!</p>
        <p>확인을 누르시면 배틀이 종료됩니다.</p>
      </Modal>
    </div>
  );
};

export default ContinuousBattlePage;
