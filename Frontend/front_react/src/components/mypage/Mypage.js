import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./Mypage.css";

function Mypage() {
  return (
    <div
      className="pageBody"
      style={{
        backgroundColor: "#16171B",
        padding: "30px",
      }}
    >
      {/* Container 태그로 4개 구역으로 분리 */}
      <Container className="justify-content-md-center">
        {/* 개인 정보 표시 영역 */}
        <Row>
          <Col xs={4} className="textHighlight block">
            <img
              src="./user.png"
              alt="프사"
              className="justify-content-center userImg"
            ></img>
            <p>사용자 프로필</p>
          </Col>

          {/* 스트릭 및 티어 정보 표시 */}
          <Col className="textHighlight block">스트릭 정보</Col>
        </Row>
        <Row>
          {/* 친구 정보 표시 */}
          <Col xs={4} className="textHighlight block">
            <p>친구 정보</p>
          </Col>

          {/* 전적 정보 표시 */}
          <Col className="textHighlight block">
            전적 정보
            <Row>
              <h4>모두</h4>
              <h4>스피드전</h4>
              <h4>최적화전</h4>
            </Row>
            <Row>
              <p>전적 정보가 없습니다.</p>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Mypage;
