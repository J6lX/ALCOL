import { Button, Row, Col, Pagination, Input } from "antd";
import "./Ranking.css";
import rankingHeader from "../../assets/ranking_header.png";

function Ranking() {
  return (
    <>
      <div>
        {/* 페이지 제목(이미지 위에 띄우기) */}
        <Row justify="center">
          <Col align="middle" xs={0} md={16} className="title">
            <h1>랭킹 페이지</h1>
          </Col>
        </Row>
        <img
          src={rankingHeader}
          alt="rankingHeader"
          className="headerImg"
          style={{
            maxWidth: "100%",
          }}></img>
        <Row justify="space-around" className="bodyblock">
          <Col span={16}>
            {/* 검색 상자 */}
            <Row justify="end">
              <Col>
                <Input
                  placeholder="닉네임으로 검색"
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
                    {/* 토글 버튼 목록 */}
                    <Row className="select">
                      <Col span={8}>
                        <h3>레벨</h3>
                      </Col>
                      <Col span={8}>
                        <h3>스피드</h3>
                      </Col>
                      <Col span={8}>
                        <h3>최적화</h3>
                      </Col>
                    </Row>
                    <hr></hr>

                    {/* 내 랭킹 표시 */}
                    <Row justify="center">
                      <Col>
                        <div className="profileBox">MyRanking</div>
                      </Col>
                    </Row>

                    {/* 랭커 순위 표시 */}
                    <Row justify="center">
                      <Col>
                        <h2>랭킹 정보</h2>
                      </Col>
                    </Row>
                    <hr></hr>
                    <Row justify="center">
                      <Col>
                        <h3>RankerRankingInfo</h3>
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
