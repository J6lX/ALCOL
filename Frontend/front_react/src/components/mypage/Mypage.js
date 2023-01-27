import Container from "react-bootstrap/Container";
import { Button, Row, Col, Space } from "antd";
import "./Mypage.css";
import settingIcon from "../../assets/setting.png";
import tempImg from "../../logo.svg";

function Mypage() {
  return (
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
          <Col
            xs={4}
            className="text block"
            style={{
              justifyContent: "center",
            }}>
            {/* 설정 아이콘 표시 블록 */}
            <Row>
              <Col md={{ offset: 16 }} lg={{ offset: 20 }}>
                <img src={settingIcon} alt="settings" className="settingIcon" />
              </Col>
            </Row>

            {/* 개인 정보 표시 블록 */}
            <Row justify="center">
              <Col>
                {/* 이미지를 정상적으로 불러올 수 없는 경우 대체 이미지가 납작하게 표시되는 현상 발생 중 */}
                <img src={tempImg} alt="프사" className="userImg" />
                <h1>Username</h1>
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
        <Row justify="center">
          {/* 친구 정보 표시 */}
          <Col xs={4} className="textHighlight block">
            <p>친구 정보</p>
            <p>친구 1</p>
          </Col>

          {/* 전적 정보 표시 블록 */}
          <Col sm={9} lg={12} className="textHighlight block">
            {/* 필터 블록(모두/스피드전/효율성전 선택 버튼) */}
            <Row justify="space-around" className="modeSelector">
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
  );
}

export default Mypage;
