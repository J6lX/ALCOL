import { React, useState } from "react";
// import { RecoilRoot, atom, useRecoilState } from "recoil";

import Logo from "../../assets/alcol_empty_black.png";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
// import { oneDark } from "@codemirror/theme-one-dark";
import { darcula } from "@uiw/codemirror-theme-darcula";
import "./PracticeSolvingPage.css";
import { Button, Modal } from "antd";

const BattleNav = () => {
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();

  return (
    <div className="BattleNav">
      <img src={Logo} alt="alcol_logo_black" style={{ height: "5vh", marginLeft: "20px" }} />
      <div style={{ display: "flex", marginRight: "10vw" }}>
        <p
          className="NanumSquare"
          style={{ color: "black", fontSize: "2.5vh", marginRight: "3vw" }}>
          문제 풀이
        </p>
      </div>
      <p className="NanumSquare" style={{ color: "black", fontSize: "2.5vh", marginRight: "20px" }}>
        {hours} : {minutes}
      </p>
    </div>
  );
};

const Problem = () => {
  return (
    <div style={{ border: "0.1px solid gray" }}>
      <div style={{ width: "29.6vw", height: "7vh", border: "0.1px solid gray" }}>
        <p
          className="NanumSquare"
          style={{ color: "white", fontSize: "2.5vh", fontWeight: "bold", padding: "2%" }}>
          이상한 술집
        </p>
      </div>
      <div
        className="scrollDesign"
        style={{
          width: "29.6vw",
          height: "84.7vh",
          overflowY: "scroll",
          backgroundColor: "#1D1E22",
        }}>
        <p className="NanumSquare" style={{ color: "white", padding: "5px", fontSize: "2.3vh" }}>
          문제 내용
        </p>
        <hr style={{ height: "1px", background: "gray" }} />
        <p
          className="NanumSquare"
          style={{ color: "white", lineHeight: "2", padding: "5px", fontWeight: "lighter" }}>
          프로그래밍 대회 전날, 은상과 친구들은 이상한 술집에 모였다. 이 술집에서 막걸리를 시키면
          주전자의 용량은 똑같았으나 안에 들어 있는 막걸리 용량은 랜덤이다. 즉 한 번 주문에 막걸리
          용량이 802ml 이기도 1002ml가 나오기도 한다. 은상은 막걸리 N 주전자를 주문하고, 자신을
          포함한 친구들 K명에게 막걸리를 똑같은 양으로 나눠주려고 한다. 그런데 은상과 친구들은 다른
          주전자의 막걸리가 섞이는 것이 싫어서, 분배 후 주전자에 막걸리가 조금 남아 있다면 그냥
          막걸리를 버리기로 한다. (즉, 한 번 주문한 막걸리에 남은 것을 모아서 친구들에게 다시 주는
          경우는 없다. 예를 들어 5명이 3 주전자를 주문하여 1002, 802, 705 ml의 막걸리가 각 주전자에
          담겨져 나왔고, 이것을 401ml로 동등하게 나눴을 경우 각각 주전자에서 200ml, 0m, 304ml 만큼은
          버린다.) 이럴 때 K명에게 최대한의 많은 양의 막걸리를 분배할 수 있는 용량 ml는 무엇인지
          출력해주세요.
        </p>
        <br />
        <hr style={{ height: "1px", background: "gray" }} />
        <p className="NanumSquare" style={{ color: "white", padding: "5px", fontSize: "2.3vh" }}>
          입력
        </p>
        <hr style={{ height: "1px", background: "gray" }} />
        <p
          className="NanumSquare"
          style={{ color: "white", lineHeight: "2", padding: "5px", fontWeight: "lighter" }}>
          첫째 줄에는 은상이가 주문한 막걸리 주전자의 개수 N, 그리고 은상이를 포함한 친구들의 수 K가
          주어진다. 둘째 줄부터 N개의 줄에 차례로 주전자의 용량이 주어진다. N은 10000이하의
          정수이고, K는 1,000,000이하의 정수이다. 막걸리의 용량은 2의 23 빼기 1 보다 작거나 같은
          자연수 또는 0이다. 단, 항상 N ≤ K 이다. 즉, 주전자의 개수가 사람 수보다 많을 수는 없다.
        </p>
        <br />
        <hr style={{ height: "1px", background: "gray" }} />
        <p className="NanumSquare" style={{ color: "white", padding: "5px", fontSize: "2.3vh" }}>
          출력
        </p>
        <hr style={{ color: "gray" }} />
        <p
          className="NanumSquare"
          style={{ color: "white", lineHeight: "2", padding: "5px", fontWeight: "lighter" }}>
          첫째 줄에 K명에게 나눠줄 수 있는 최대의 막걸리 용량 ml 를 출력한다.
        </p>
      </div>
    </div>
  );
};

const CodingPlace = () => {
  // let allheight = window.innerHeight
  // let height = allheight * 0.46
  // console.log(height)
  let [code, setCode] = useState("");
  // let [solvingHeight, setHeight] = useState(height);
  // let [isClick, setIsClick] = useState(false);

  const onChange = (newValue) => {
    setCode(newValue);
    console.log("code ", code);
  };

  // const upMouse = (event) => {
  //   setIsClick(false)
  // }

  // const downMouse = (event) => {
  //   setIsClick(true)
  // }

  // const moveHeight = (event) => {
  //   if (isClick === true) {
  //     console.log(event)
  //     setHeight(solvingHeight-1)
  //   }
  //   // console.log(solvingHeight);
  // };

  // 제출 이벤트
  const clickSubmit = () => {
    console.log("submit ", code);
  };

  // 제출 확인 모달 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ width: "70vw", height: "7vh", border: "0.1px solid gray", textAlign: "right" }}>
        <p
          className="NanumSquare"
          style={{ color: "white", fontSize: "2vh", height: "100%", padding: "2%" }}>
          코딩할 언어: python
        </p>
      </div>
      <div
        id="console"
        style={{
          width: "69.5vw",
          height: "46vh",
          verticalAlign: "top",
        }}>
        <CodeMirror
          value={code}
          width="70vw"
          height="46vh"
          extensions={[python({ jsx: true })]}
          onChange={onChange}
          theme={darcula}
        />
      </div>
      {/* onMouseDown={downMouse} onMouseUp={upMouse} onMouseMove={moveHeight}   */}
      <div style={{ width: "70vw", height: "0.7vh", background: "gray" }}></div>
      <div
        style={{
          width: "70vw",
          height: "5.3vh",
          border: "0.1px solid gray",
        }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
          }}>
          <p
            className="NanumSquare"
            style={{ color: "white", marginLeft: "10px", fontSize: "2.1vh" }}>
            결과창
          </p>
          <div>
            <Button className="NanumSquare" style={{ margin: "5px" }} onClick={clickSubmit}>
              제출
            </Button>
            <Button className="NanumSquare" style={{ margin: "5px" }} onClick={showModal}>
              나가기
            </Button>
          </div>
        </div>
      </div>
      <Modal title="나가기" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p className="NanumSquare">정말로 나가시겠습니까?</p>
      </Modal>
    </div>
  );
};

const Console = () => {
  return (
    <div style={{ backgroundColor: "#1D1E22" }}>
      <div></div>
    </div>
  );
};

const PracticeSolvingPage = () => {
  return (
    <div id="allconsole">
      {/* <RecoilRoot>
        <BattleNav />
        <Problem />
        <CodingPlace />
        <ButtonsLayer />
        <Console />
      </RecoilRoot> */}
      <div>
        <BattleNav />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            border: "0.1px solid gray",
          }}>
          <div style={{ width: "30vw", height: "92vh", border: "0.1px solid gray" }}>
            <Problem />
          </div>
          <div>
            <div style={{ width: "70vw", height: "59vh", border: "0.1px solid gray" }}>
              <CodingPlace />
            </div>
            <div style={{ width: "70vw", height: "33vh", border: "0.1px solid gray" }}>
              <Console />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeSolvingPage;
