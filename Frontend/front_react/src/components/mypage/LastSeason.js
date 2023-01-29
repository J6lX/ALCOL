import { Button, Row, Col, Space, Tooltip } from "antd";
import "./LastSeason.css";
import settingIcon from "../../assets/setting.png";
import tempImg from "../../logo.svg";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

// 현재 로그인한 사용자 정보
const userData = {
  dongjun: {
    name: "Dongjun", // 이름
    battleRec: {}, // 전적
    friends: {}, // 친구 목록
  },
  tester: {
    name: "Tester",
    battleRec: {},
    friends: {},
  },
};

function Mypage() {
  const userInfo = useParams();
  const profile = userData[userInfo.username];

  return (
    <div>
      {profile ? (
        <div
          className="pageBody"
          style={{
            backgroundColor: "#16171B",
            padding: "30px",
          }}>
          <Row justify="center">
            <Col span={21}>
              <h1>지난 시즌 이력</h1>
            </Col>
          </Row>
          <Row justify="center">
            {/* 필터 탭 블록 */}
            <Col xs={16} md={6} lg={4} className="text block">
              {/* 전체 보기 탭 */}
              <Row className="miniBlock">
                <Col className="innerText">
                  <Link to="/modify">전체보기 </Link>
                </Col>
              </Row>

              {/* 스피드만 보기 탭 */}
              <Row className="miniBlock">
                <Col className="innerText">
                  <Link to="/modify">스피드 </Link>
                </Col>
              </Row>
              {/* 최적화만 보기 탭 */}
              <Row className="miniBlock">
                <Col className="innerText">
                  <Link to="/modify">최적화 </Link>
                </Col>
              </Row>
            </Col>

            {/* 지난 시즌 정보 표시 블록*/}
            <Col xs={16} lg={18} className="text block">
              <Row>
                {/* 한 줄에 3개씩 표시 */}
                <Col span={8} align="middle">
                  <p>지난 시즌 정보 1</p>
                </Col>
                <Col span={8} align="middle">
                  <p>지난 시즌 정보 2</p>
                </Col>
                <Col span={8} align="middle">
                  <p>지난 시즌 정보 3</p>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      ) : (
        <Row
          justify="center"
          align="middle"
          style={{
            height: "500px",
          }}>
          <Col align="middle">
            <span
              style={{
                color: "white",
              }}>
              등록되지 않은 사용자입니다.
            </span>
            <Link to="/">
              <p>메인 화면으로</p>
            </Link>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default Mypage;
