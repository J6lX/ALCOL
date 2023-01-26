import { Button, Row, Col, Space } from "antd";
import "./Ranking.css";
import rankingHeader from "../../assets/ranking_header.png";
function Ranking() {
  return (
    <>
      <img src={rankingHeader} alt="rankingHeader" className="headerImg"></img>
      <Row justify="center">
        <Col className="block" span={16}>
          <h1>랭킹 페이지</h1>
        </Col>
      </Row>
      <Row justify="center">
        <Col className="block" offset={6} span={16}>
          <h2>여기에 랭킹 정보 표시</h2>
        </Col>
      </Row>
    </>
  );
}

export default Ranking;
