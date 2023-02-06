import { React, useRef } from "react";
import BanPage from "./BanPage";
// import SelectedProblemPage from "./SelectedProblemPage";
import SolvingPage from "./SolvingPage";
import ResultPage from "./ResultPage";
import ResultListPage from "./ResultListPage";
// import { atom, useRecoilState } from "recoil";

// const personIdState = atom({
//   key: "personIdState",
//   default: "",
// });

const ContinuousBattlePage = () => {
  // 매치에서 받은 상대방 id 정보
  // const [personId, setPersonId] = useRecoilState(personIdState);

  console.log("주소", window.location.host, window.location.pathname);
  const wsurl = useRef("wss://" + window.location.host + window.location.pathname);
  const vdo = useRef(null);
  // const message = useRef('')
  console.log(wsurl.current);

  // const [myStream, setMyStream] = useState(null)
  const socket = new WebSocket(wsurl.current);

  //STUN 서버에서 내 정보 가져오기
  let configuration = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };

  //Peer 생성
  const myPeerConnection = new RTCPeerConnection(configuration);

  let channel = myPeerConnection.createDataChannel("sendData", null);

  // 소켓 연결 콜백함수
  socket.onopen = () => {
    console.log("Connect WebSocket");
  };

  channel.onopen = function (e) {
    console.log("Connect dataChannel");
  };

  // 소켓에서 메세지를 받아왔을 때 콜백함수
  socket.onmessage = async (msg) => {
    let content = JSON.parse(msg.data);

    if (content.event === "offer") {
      // offer가 오면 가장먼저 그 오퍼를 리모트 디스크립션으로 등록
      let offer = content.data;
      myPeerConnection.setRemoteDescription(offer);

      // 받는 쪽에서도 자신의 미디어를 켠다.
      const myDisplay = await getMedia();
      myPeerConnection.addTrack(myDisplay.getTracks()[0]);
      // myPeerConnection.
      // send answer
      let answer = await myPeerConnection.createAnswer();
      myPeerConnection.setLocalDescription(answer);

      send({
        event: "answer",
        data: answer,
      });
    } else if (content.event === "answer") {
      let answer = content.data;
      myPeerConnection.setRemoteDescription(answer);
    } else if (content.event === "candidate") {
      //리모트 디스크립션에 설정되어있는 피어와의 연결방식을 결정
      myPeerConnection.addIceCandidate(content.data);
    }
  };

  channel.onmessage = function (e) {
    console.log(e.data);
  };

  // 미디어와 관련된 변수를 선언.
  // myFace는 element를 받고 myStream엔 영상 내용을 담음.
  //미디어 내용 받기
  async function getMedia() {
    try {
      const Stream = await navigator.mediaDevices.getDisplayMedia({
        audio: false,
        video: true,
      });
      return Stream;
    } catch (e) {
      console.log(e);
      console.log("미디어를 가져오는 중 에러 발생");
    }
    return null;
  }

  async function createOffer() {
    // '오퍼를 생성' 버튼 클릭
    // 카메라를 키면서 myStream에도 미디어 정보를 담기
    const myDisplay = await getMedia();

    vdo.current.srcObject = myDisplay;
    // console.log(myDisplay)
    // getMedia에서 가져온 audio, video 트랙을 myPeerConnection에 등록

    myPeerConnection.addTrack(myDisplay.getTracks()[0]);

    // 오퍼 생성
    let offer = await myPeerConnection.createOffer();
    // console.log("오퍼", offer)

    // 나의 offer 전송
    await send({
      event: "offer",
      data: offer,
    });

    myPeerConnection.setLocalDescription(offer);
    // console.log(myPeerConnection)
  }

  async function createConnect() {
    const msg = document.querySelector("#message").value;
    // console.log(msg);
    channel.send(msg);
  }

  async function send(message) {
    // 소켓으로 메세지 보내기
    socket.send(JSON.stringify(message));
    console.log("메세지", message);
    console.log(vdo);
  }

  // function sendCandidate(event) {
  //     send({
  //       event: "candidate",
  //       data: event.candidate,
  //     });
  //   }
  return (
    <div>
      <br />
      <br />
      <br />
      <div>
        <input id="message" type="text" />
        <button onClick={createConnect}>보내</button>
      </div>
      <div>
        <button onClick={createOffer}>눌러</button>
        {/* <p>{message}</p> */}
        {/* <video ref={vdo} autoPlay></video> */}
      </div>
      <div>
        <BanPage />
        {/* <SelectedProblemPage /> */}
        <SolvingPage />
        <ResultPage />
        <ResultListPage />
      </div>
    </div>
  );
};

export default ContinuousBattlePage;
