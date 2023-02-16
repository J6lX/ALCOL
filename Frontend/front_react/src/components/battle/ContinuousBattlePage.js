import { React, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
// import $ from "jquery";
import ReadyPage from "./ReadyPage";
import BanPage from "./BanPage";
import WaitOtherBanPage from "./WaitOtherBanPage";
import SelectedProblemPage from "./SelectedProblemPage";
import SolvingPage from "./SolvingPage";
import SolvingOptPage from "./SolvingOptPage";
import ResultPage from "./ResultPage";
import ResultListPage from "./ResultListPage";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { message, Modal } from "antd";
import {
  selectedMode,
  selectedLanguage,
  matchingPlayerInfo,
  resultListResultInfo,
  sendConnect,
  sendGetProblem,
  sendBattleStart,
  isSubmitSpin,
} from "../../states/atoms";

// let submitResult = "";
const serverAddress = "i8b303.p.ssafy.io:8000";
const websocketAddress = "ws://" + serverAddress + "/battle-service";
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
  const [isSendTimeout, setIsSendTimeout] = useState(false);
  // const [problemNumber, setProblemNumber] = useState("-1");
  const [problems, setProblems] = useState([]);
  const [problemInfo, setProblemInfo] = useState([]);
  const [battleResult, setBattleResult] = useState("");
  const [resultListResult, setResultListResult] = useRecoilState(resultListResultInfo);
  const [checkConnect, setCheckConnect] = useRecoilState(sendConnect);
  const [checkGetProblem, setCheckGetProblem] = useRecoilState(sendGetProblem);
  const [checkBattleStart, setCheckBattleStart] = useRecoilState(sendBattleStart);
  const setIsSubmitSpin = useSetRecoilState(isSubmitSpin);
  // const code = useRecoilValue(userCode);
  const idInfo = useRecoilValue(matchingPlayerInfo);
  const battleModeInfo = useRecoilValue(selectedMode);
  const languageMode = useRecoilValue(selectedLanguage);

  const [nickname, setNickname] = useState("a");
  const [level, setLevel] = useState("a");
  const [speedTier, setSpeedTier] = useState("a");
  const [optTier, setOptTier] = useState("a");
  const [imageAddress, setImageAddress] = useState("a");
  const [othernickname, setOtherNickname] = useState("b");
  const [otherLevel, setOtherLevel] = useState("b");
  const [otherspeedTier, setOtherSpeedTier] = useState("b");
  const [otheroptTier, setOtherOptTier] = useState("b");
  const [otherImageAddress, setOtherImageAddress] = useState("b");
  useEffect(() => {}, [nickname, speedTier, optTier]);
  useEffect(() => {}, [othernickname, otherspeedTier, otheroptTier]);

  const history = useHistory();

  const messageType = "connect";
  const userId = idInfo.userId;
  const otherId = idInfo.otherId;
  const hostCheck = idInfo.hostCheck;
  const battleMode = battleModeInfo;

  // let score = ""

  useEffect(() => {
    axios
      .post("http://i8b303.p.ssafy.io:8000/user-service/getUserInfo", {
        user_id: userId,
      })
      .then(function (response) {
        setNickname(response.data.nickname);
        setLevel(response.data.level);
        setSpeedTier(response.data.speed_tier);
        setOptTier(response.data.optimization_tier);
        setImageAddress(response.data.stored_file_name);
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
        setOtherLevel(response.data.level);
        setOtherSpeedTier(response.data.speed_tier);
        setOtherOptTier(response.data.optimization_tier);
        setOtherImageAddress(response.data.stored_file_name);
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

    socket.onopen = () => {
      if (checkConnect === "-1") {
        sleep(500, () => {
          setCheckConnect("0");
        }).then(() => {
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
      const data = JSON.parse(servermessage.data);
      if (data.messageType === "connect_success") {
        if (checkGetProblem === "-1") {
          sleep(500, () => {
            setCheckGetProblem("0");
          }).then(() => {
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
        setTimeout(() => {
          setIsReady(false);
          setIsBanWait(true);
        }, 300);
      } else if (data.messageType === "select_success") {
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
            }, 10600);
          }, 1000);
        }, 1000);
      } else if (data.messageType === "closed") {
        socket.close();
      } else if (data.messageType === "sendProblem") {
        const problemsdata = [data.problems];
        setProblems(problemsdata);
        setTimeout(() => {
          setIsConnected(true);
          setIsReady(true);
        }, 30);
        setTimeout(() => {
          console.log("");
        }, 300);
      } else if (data.messageType === "submitResult") {
        if (battleMode === "speed") {
          const result = {
            nick: "me",
            mode: battleMode,
            language: languageMode,
            result: `${data.accepted} / ${data.testcase}`,
            time: data.time,
            memory: data.memory,
          };
          setResultListResult((resultList) => [...resultList, result]);
          const modaldata = {
            title: "오답!",
            content: (
              <div>
                <p className="NanumSquare">틀렸습니다!</p>
                <p className="NanumSquare">테스트케이스를 모두 맞추지 못했습니다.</p>
                <p className="NanumSquare">
                  {data.accepted} / {data.testcase}
                </p>
                <p className="NanumSquare">그러나 {othernickname} 님은 긴장하고 있겠군요.</p>
                <small className="NanumSquare">제출을 하면 상대방에게 소식이 전달됩니다.</small>
              </div>
            ),
            okText: "확인",
            onOk() {
              setIsSubmitSpin(false);
            },
          };
          info(modaldata);
        } else if (battleMode === "optimization") {
          if (data.submitResult === "accept") {
            const result = {
              nick: "me",
              mode: battleMode,
              language: languageMode,
              result: "accepted",
              time: data.time,
              memory: data.memory,
            };
            setResultListResult((resultList) => [...resultList, result]);
            const modaldata = {
              title: "정답!",
              content: (
                <div>
                  <p className="NanumSquare">축하합니다!</p>
                  <p className="NanumSquare">모든 테스트케이스를 맞췄습니다!</p>
                  <p className="NanumSquare">빠르게 나아가는 {nickname} 님!!</p>
                  <small className="NanumSquare">과연 더 효율적인 코드가 나올 수 있을까요??</small>
                </div>
              ),
              okText: "확인",
              onOk() {
                setIsSubmitSpin(false);
              },
            };
            info(modaldata);
          } else if (data.submitResult === "fail") {
            const result = {
              nick: "me",
              mode: battleMode,
              language: languageMode,
              result: `${data.accepted} / ${data.testcase}`,
              time: "없음",
              memory: "없음",
            };
            setResultListResult((resultList) => [...resultList, result]);
            const modaldata = {
              title: "오답!",
              content: (
                <div>
                  <p className="NanumSquare">틀렸습니다!</p>
                  <p className="NanumSquare">테스트케이스를 모두 맞추지 못했습니다.</p>
                  <p className="NanumSquare">그러나 {othernickname} 님은 긴장하고 있겠군요.</p>
                  <small className="NanumSquare">제출을 하면 상대방에게 소식이 전달됩니다.</small>
                </div>
              ),
              okText: "확인",
              onOk() {
                setIsSubmitSpin(false);
              },
            };
            info(modaldata);
          }
        }
      } else if (data.messageType === "otherSubmitResult") {
        if (data.submitResult === "accept") {
          const result = {
            nick: "other",
            mode: battleMode,
            language: languageMode,
            result: "accepted",
            time: data.time,
            memory: data.memory,
          };
          submitOther("accept", "all");
          setResultListResult((resultList) => [...resultList, result]);
        } else if (data.submitResult === "fail") {
          const result = {
            nick: "other",
            mode: battleMode,
            language: languageMode,
            result: `${data.accepted} / ${data.testcase}`,
            time: "없음",
            memory: "없음",
          };
          submitOther(data.testcase, data.accepted);
          setResultListResult((resultList) => [...resultList, result]);
        }
      } else if (data.messageType === "error") {
        const result = {
          nick: "me",
          mode: battleMode,
          language: languageMode,
          result: "error",
          error: data.errorMessage,
        };
        setResultListResult((resultList) => [...resultList, result]);
      } else if (data.messageType === "otherError") {
        const result = {
          nick: "other",
          mode: battleMode,
          language: languageMode,
          result: "error",
          error: data.errorMessage,
        };
        submitOther(data.testcase, data.accepted);
        setResultListResult((resultList) => [...resultList, result]);
      } else if (data.messageType === "socketError") {
        showSocketErrorModal();
      } else if (data.messageType === "otherSurrender") {
        setBattleResult(data);
        showOppSurrenderModal();
      } else if (data.messageType === "battleResult") {
        setBattleResult(data);
        if (battleMode === "speed") {
          if (data.battleResult === "win") {
            const result = {
              nick: "me",
              mode: battleMode,
              language: languageMode,
              result: "accepted",
              time: data.time,
              memory: data.memory,
            };
            setResultListResult((resultList) => [...resultList, result]);
            const modaldata = {
              title: "승리!",
              content: (
                <div>
                  <p className="NanumSquare">축하합니다!</p>
                  <p className="NanumSquare">모든 테스트케이스를 맞췄습니다!</p>
                  <p className="NanumSquare">승리를 거머쥔 {nickname} 님!!</p>
                </div>
              ),
              okText: "확인",
              onOk() {
                setIsSubmitSpin(false);
                showFinishModal();
              },
            };
            info(modaldata);
          } else if (data.battleResult === "lose") {
            showOppSubmitModal();
          } else if (data.battleResult === "draw") {
            const modaldata = {
              title: "배틀 시간 초과!",
              content: (
                <div>
                  <p className="NanumSquare">배틀 시간이 종료되었습니다.</p>
                </div>
              ),
              okText: "확인",
              onOk() {
                showFinishModal();
              },
            };
            info(modaldata);
          } else if (data.battleResult === "surrender") {
            showFinishModal();
          }
        } else if (battleMode === "optimization") {
          if (data.battleResult === "win") {
            const modaldata = {
              title: "승리!",
              content: (
                <div>
                  <p className="NanumSquare">축하합니다!</p>
                  <p className="NanumSquare">승리했습니다!</p>
                  <p className="NanumSquare">승리를 거머쥔 {nickname} 님!!</p>
                </div>
              ),
              okText: "확인",
              onOk() {
                showFinishModal();
              },
            };
            info(modaldata);
          } else if (data.battleResult === "lose") {
            showOppSubmitModal();
          } else if (data.battleResult === "draw") {
            const modaldata = {
              title: "비겼습니다.",
              content: (
                <div>
                  <p className="NanumSquare">두 사람의 효율성이 동일합니다!</p>
                  <p className="NanumSquare">이럴수가! 우열을 가릴 수가 없네요!!</p>
                  <p className="NanumSquare">확인을 누르시면 배틀이 종료됩니다.</p>
                </div>
              ),
              okText: "확인",
              onOk() {
                showFinishModal();
              },
            };
            info(modaldata);
          } else if (data.battleResult === "draw_timeout") {
            const modaldata = {
              title: "배틀 시간 초과!",
              content: (
                <div>
                  <p className="NanumSquare">배틀 시간이 종료되었습니다.</p>
                </div>
              ),
              okText: "확인",
              onOk() {
                showFinishModal();
              },
            };
            info(modaldata);
          } else if (data.battleResult === "surrender") {
            showFinishModal();
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

  const [isOppSubmitModalOpen, setIsOppSubmitModalOpen] = useState(false);
  const showOppSubmitModal = () => {
    setIsOppSubmitModalOpen(true);
  };
  const oppSubmitHandleOk = () => {
    // socket.send(
    //   JSON.stringify({
    //     messageType: "finish",
    //     userId: userId,
    //     otherId: otherId,
    //   })
    // );
    setIsOppSubmitModalOpen(false);
    setIsSolving(false);
    setIsSolved(true);
  };

  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const showFinishModal = () => {
    setIsFinishModalOpen(true);
  };
  const finishHandleOk = () => {
    // socket.send(
    //   JSON.stringify({
    //     messageType: "finish",
    //     userId: userId,
    //     otherId: otherId,
    //   })
    // );
    setIsFinishModalOpen(false);
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
    // socket.send(
    //   JSON.stringify({
    //     messageType: "finish",
    //     userId: userId,
    //     otherId: otherId,
    //   })
    // );
    setIsOppSurrenderModalOpen(false);
    setIsSolving(false);
    setIsSolved(true);
  };

  const [isSocketErrorModalOpen, setIsSocketErrorModalOpen] = useState(false);
  const showSocketErrorModal = () => {
    setIsSocketErrorModalOpen(true);
  };
  const socketErrorHandleOk = () => {
    setIsSocketErrorModalOpen(false);
    history.push("/");
  };

  const [messageApi, contextHolder] = message.useMessage();
  const submitOther = (testcase, accepted) => {
    if (testcase === "accept") {
      messageApi.open({
        type: "warning",
        content: `${othernickname}님이 코드를 제출했습니다. (테스트케이스 전부 정답!)`,
        duration: 3,
        style: { marginTop: "5.5vh" },
      });
    } else {
      messageApi.open({
        type: "warning",
        content: `${othernickname}님이 코드를 제출했습니다. (테스트케이스 ${testcase}개 중 ${accepted}개 정답)`,
        duration: 3,
        style: { marginTop: "5.5vh" },
      });
    }
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

  const changeBanProblem = (data) => {
    if (data === "timeout" && isSendTimeout === false) {
      setIsSendTimeout(true);
      socket.send(
        JSON.stringify({
          messageType: "banTimeout",
          userId: userId,
          otherId: otherId,
          problemNumber: data,
        })
      );
    }
    // setProblemNumber(data);
    if (data !== "timeout" && isBanWait === false) {
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

  const submit = (codedata, problemNumber) => {
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

  const clickSurrender = () => {
    showSurrenderModal();
  };

  const codeEmit = (codedata) => {
    code = codedata;
  };

  const copyCode = () => {
    const element = document.createElement("textarea");
    element.value = code;
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
              user: {
                nick: nickname,
                level: level,
                speedTier: speedTier,
                optTier: optTier,
                imageAddress: imageAddress,
              },
              other: {
                nick: othernickname,
                level: otherLevel,
                speedTier: otherspeedTier,
                optTier: otheroptTier,
                imageAddress: otherImageAddress,
              },
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
              user: {
                nick: nickname,
                level: level,
                speedTier: speedTier,
                optTier: optTier,
                imageAddress: imageAddress,
              },
              other: {
                nick: othernickname,
                level: otherLevel,
                speedTier: otherspeedTier,
                optTier: otheroptTier,
                imageAddress: otherImageAddress,
              },
            }}
          />
        )}
        {isConnected && isSolving && battleMode === "speed" && (
          <SolvingPage
            problemInfo={problemInfo}
            battleMode={battleModeInfo}
            battleLanguage={languageMode}
            battleuserinfo={{
              user: {
                nick: nickname,
                level: level,
                speedTier: speedTier,
                optTier: optTier,
                imageAddress: imageAddress,
              },
              other: {
                nick: othernickname,
                level: otherLevel,
                speedTier: otherspeedTier,
                optTier: otheroptTier,
                imageAddress: otherImageAddress,
              },
            }}
            submitMessage={resultListResult}
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
              user: {
                nick: nickname,
                level: level,
                speedTier: speedTier,
                optTier: optTier,
                imageAddress: imageAddress,
              },
              other: {
                nick: othernickname,
                level: otherLevel,
                speedTier: otherspeedTier,
                optTier: otheroptTier,
                imageAddress: otherImageAddress,
              },
            }}
            submitMessage={resultListResult}
            submit={submit}
            clickSurrender={clickSurrender}
            codeEmit={codeEmit}
          />
        )}
        {isSolved && (
          <ResultPage
            props={battleResult}
            battleuserinfo={{
              user: {
                nick: nickname,
                level: level,
                speedTier: speedTier,
                optTier: optTier,
                imageAddress: imageAddress,
              },
              other: {
                nick: othernickname,
                level: otherLevel,
                speedTier: otherspeedTier,
                optTier: otheroptTier,
                imageAddress: otherImageAddress,
              },
            }}
            showDetailResult={showDetailResult}
          />
        )}
        {isOpenDetail && (
          <ResultListPage
            problemInfo={problemInfo}
            battleMode={battleModeInfo}
            battleLanguage={languageMode}
            battleuserinfo={{
              user: {
                nick: nickname,
                level: level,
                speedTier: speedTier,
                optTier: optTier,
                imageAddress: imageAddress,
              },
              other: {
                nick: othernickname,
                level: otherLevel,
                speedTier: otherspeedTier,
                optTier: otheroptTier,
                imageAddress: otherImageAddress,
              },
            }}
          />
        )}
      </div>
      <Modal
        title={`${othernickname}의 네트워크 오류`}
        open={isSocketErrorModalOpen}
        onOk={socketErrorHandleOk}
        okText="확인"
        onCancel={copyCode}
        cancelText="코드 복사"
        closable={false}>
        {contextCopyHolder}
        <p className="NanumSquare">상대방 "{othernickname} 님"의 인터넷 연결이 이상합니다.</p>
        <p className="NanumSquare">배틀이 종료됩니다.</p>
        <p className="NanumSquare">
          지금까지 쓴 코드를 클립보드에 복사하려면 코드 복사 버튼을 누르세요!
        </p>
        <p className="NanumSquare">확인을 누르시면 배틀이 종료됩니다.</p>
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
        {battleMode === "speed" && (
          <p className="NanumSquare">상대방 "{othernickname} 님"이 먼저 문제를 풀었습니다.</p>
        )}
        {battleMode === "optimiztion" && (
          <p className="NanumSquare">상대방 "{othernickname} 님"이 더 효율적으로 풀었습니다.</p>
        )}
        <p className="NanumSquare">
          지금까지 쓴 코드를 클립보드에 복사하려면 코드 복사 버튼을 누르세요!
        </p>
        <p className="NanumSquare">확인을 누르시면 배틀이 종료됩니다.</p>
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
        <p className="NanumSquare">상대방 "{othernickname} 님"이 항복을 선언했습니다.</p>
        <p className="NanumSquare">
          지금까지 쓴 코드를 클립보드에 복사하려면 코드 복사 버튼을 누르세요!
        </p>
        <p className="NanumSquare">확인을 누르시면 배틀이 종료됩니다.</p>
      </Modal>
      <Modal
        title="항복"
        open={isSurrenderModalOpen}
        onOk={surrenderHandleOk}
        okText="네"
        onCancel={surrenderHandleCancel}
        cancelText="아니오">
        <p className="NanumSquare">정말로 항복하시겠습니까?</p>
      </Modal>
      <Modal
        title="배틀이 종료되었습니다."
        open={isFinishModalOpen}
        onOk={finishHandleOk}
        okText="확인"
        onCancel={copyCode}
        cancelText="코드 복사">
        <p className="NanumSquare">배틀이 정상적으로 종료되었습니다.</p>
        <p className="NanumSquare">
          현재까지 쓴 코드를 복사하고 싶다면 "코드 복사" 버튼을 눌러주세요!
        </p>
      </Modal>
    </div>
  );
};

export default ContinuousBattlePage;
