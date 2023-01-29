import { Button, Row, Col, Pagination, Input } from "antd";
import "./PracticePage.css";
import practiceHeader from "../../assets/practice_header.png";

function Ranking() {
  return (
    <>
      <div>
        {/* 페이지 제목(이미지 위에 띄우기) */}
        <Row justify="center">
          <Col align="middle" span={16} className="title">
            <h1>연습 문제 풀기</h1>
          </Col>
        </Row>
        <img
          src={practiceHeader}
          alt="rankingHeader"
          className="headerImg"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
          }}></img>
        <Row justify="space-around" className="bodyblock">
          <Col span={16}>
            {/* 검색 상자 */}
            <Row justify="end">
              <Col xs={8} lg={5}>
                <Input
                  placeholder="유형 이름 검색"
                  allowClear
                  size="middle"
                  style={{
                    margin: "5px",
                  }}
                />
              </Col>
              <Col
                style={{
                  padding: "5px",
                }}>
                <Button>검색</Button>
              </Col>
            </Row>

            {/* 랭킹 표시 블록 */}
            <Row>
              <Col span={24}>
                <Row className="block" justify="center" align="center">
                  <Col span={24}>
                    {/* 상단 설명 바 목록 */}
                    <Row className="select">
                      <Col span={4}>
                        <h3>문제 번호</h3>
                      </Col>
                      <Col span={5}>
                        <h3>문제 이름</h3>
                      </Col>
                      <Col span={9}>
                        <h3>문제 유형</h3>
                      </Col>
                      <Col span={6}>
                        <h3>문제 난이도</h3>
                      </Col>
                    </Row>
                    <hr></hr>

                    {/* 문제 목록 표시 */}

                    <Row justify="center">
                      <Col span={4}>
                        <h3>ProblemNo</h3>
                      </Col>
                      <Col span={5}>
                        <h3>ProblemName</h3>
                      </Col>
                      <Col span={9}>
                        <h3>ProblemType</h3>
                      </Col>
                      <Col span={6}>
                        <h3>ProblemDifficulty</h3>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                {/* 페이지네이션 표시 */}
                <Row justify="center">
                  <Col align="center">
                    <Pagination
                      defaultCurrent={1}
                      total={50}
                      responsive="true"
                      theme="dark"
                      style={{
                        padding: "10px",
                      }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Ranking;
