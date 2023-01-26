import Container from "react-bootstrap/Container";
import { Button, Row, Col, Space, Tooltip } from "antd";
import "./Mypage.css";
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
      {" "}
      {profile ? (
        <div
          className="pageBody"
          style={{
            backgroundColor: "#16171B",
            padding: "30px",
          }}>
          {/* Container 태그 내 4개 블록으로 분리 */}
          <Container>
            <Row
              justify="center"
              style={{
                padding: "5px",
              }}>
              <Col xs={4} className="text block">
                {/* 설정 아이콘 표시 블록 */}
                <Row>
                  <Col md={{ offset: 16 }} lg={{ offset: 20 }}>
                    <Link to="/modify">
                      <img src={settingIcon} alt="settings" className="settingIcon" />
                    </Link>
                  </Col>
                </Row>

                {/* 개인 정보 표시 블록 */}
                <Row justify="center">
                  <Col>
                    {/* 이미지를 정상적으로 불러올 수 없는 경우 대체 이미지가 납작하게 표시되는 현상 발생 중 */}
                    <img src={tempImg} alt="프사" className="userImg" />
                    <h1>{profile.name}</h1>
                  </Col>
                </Row>
              </Col>

              {/* 스트릭 및 티어 정보 표시 블록*/}
              <Col sm={8} lg={12} className="textHighlight block">
                <Row>
                  {/* 스트릭 그래프 표시 블록 */}
                  <Col
                    span={12}
                    justify="center"
                    align="middle"
                    style={{
                      paddingTop: "20px",
                      paddingBottom: "5px",
                    }}>
                    <div className="streakBox"></div>
                  </Col>

                  {/* 티어 정보 표시 블록 */}
                  <Col span={12} justify="center" align="middle">
                    <Row justify="center">
                      {/* 스피드전 티어 뱃지 */}
                      <Col>
                        <img src={tempImg} alt="프사" className="userImg"></img>
                      </Col>
                      {/* 최적화전 티어 뱃지 */}
                      <Col>
                        <img src={tempImg} alt="프사" className="userImg"></img>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                {/* 스트릭 정보(텍스트) 표시 블록 */}
                <Row>
                  <Col
                    span={11}
                    justify="center"
                    style={{
                      margin: "10px",
                    }}>
                    <p>스트릭 정보 표시</p>
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* 친구 정보, 지난 시즌, 전적 표시 */}
            <Row
              justify="center"
              style={{
                padding: "5px",
              }}>
              <Col
                xs={4}
                align="middle"
                style={{
                  margin: "10px",
                }}>
                <Row justify="center">
                  {/* 친구 정보 표시 */}
                  <Col xs={24} className="textHighlight miniBlock">
                    <p>친구 정보</p>
                    <hr />
                    <p>친구 1</p>
                  </Col>
                </Row>

                <Row>
                  {/* 지난 시즌 기록 보기 */}
                  <Col xs={24} className="miniBlock">
                    <p className="textHighlight">지난 시즌 기록</p>
                    <hr></hr>
                    <p className="textHighlight">시즌 기록 없음</p>
                  </Col>
                </Row>
              </Col>

              {/* 전적 정보 표시 블록 */}
              <Col sm={9} lg={12} className="textHighlight block">
                {/* 필터 블록(모두/스피드전/효율성전 선택 버튼) */}
                <Row justify="space-around" className="modeFilter">
                  <Col sm={3} lg={4}>
                    <h4>모두</h4>
                  </Col>
                  <Col sm={3} lg={4}>
                    <h4>스피드전</h4>
                  </Col>
                  <Col sm={3} lg={4}>
                    <h4>최적화전</h4>
                  </Col>
                </Row>

                {/* 그래프 블록(최근 20전) */}
                <Row justify="center">
                  <img className="winrateCircle" src={tempImg} alt="원형 그래프"></img>
                </Row>
                {/* 전적 표시 블록 */}
                <p className="text">전적 정보가 없습니다.</p>
              </Col>
            </Row>
          </Container>
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
