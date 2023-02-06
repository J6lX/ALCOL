import { Button, Row, Col, Input, Table, ConfigProvider, theme } from "antd";
import "./Ranking.css";
import rankingHeader from "../../assets/ranking_header.png";

// 랭커 정보 컬럼(실제 서비스에서는 표시하지 않음)
const problemLabel = [
  {
    dataIndex: "id",
    key: "id",
    title: "순위",
    align: "center",
    hidden: true,
  },
  {
    dataIndex: "name",
    key: "name",
    title: "닉네임",
    align: "center",
    hidden: true,
  },
  {
    dataIndex: "level",
    key: "level",
    title: "LEVEL",
    align: "center",
    hidden: true,
  },
  {
    dataIndex: "mmr",
    key: "mmr",
    title: "MMR",
    align: "center",
    hidden: true,
  },
  {
    dataIndex: "tier",
    key: "tier",
    title: "시즌 티어",
    align: "center",
    hidden: true,
  },
  {
    dataIndex: "record",
    key: "record",
    title: "시즌 전적",
    align: "center",
    hidden: true,
  },
];

// 연습 문제 데이터
const problemData = [
  { id: 1, name: "맥주", record: "22승 17패(56%)", tier: "Diamond" },
  { id: 2, name: "소주", record: "22승 17패(56%)", tier: "Diamond" },
  { id: 3, name: "막걸리", record: "22승 17패(56%)", tier: "Diamond" },
  { id: 4, name: "와인", record: "22승 17패(56%)", tier: "Diamond" },
  { id: 5, name: "고량주", record: "22승 17패(56%)", tier: "Diamond" },
];

function Ranking() {
  // // innerRow = 클릭 시 확장되어 추가 정보를 표시하는 용도
  // const innerRow = () => {
  //   const columns = [
  //     {
  //       title: "스피드전",
  //       dataIndex: "speedTier",
  //       key: "speedTier",
  //     },
  //     {
  //       title: "효율성전",
  //       dataIndex: "efficiencyTier",
  //       key: "efficiencyTier",
  //     },
  //   ];
  //   const data = [
  //     {
  //       id: 1,
  //       speedTier: "Diamond",
  //       efficiencyTier: "Diamond",
  //     },
  //     {
  //       id: 2,
  //       speedTier: "Diamond",
  //       efficiencyTier: "Diamond",
  //     },
  //     {
  //       id: 3,
  //       speedTier: "Diamond",
  //       efficiencyTier: "Diamond",
  //     },
  //     {
  //       id: 4,
  //       speedTier: "Diamond",
  //       efficiencyTier: "Diamond",
  //     },
  //     {
  //       id: 5,
  //       speedTier: "Diamond",
  //       efficiencyTier: "Diamond",
  //     },
  //   ];
  //   return <Table columns={columns} dataSource={data} pagination={false} />;
  // };

  return (
    <>
      <div>
        {/* 페이지 제목(이미지 위에 띄우기) */}
        <Row justify="center">
          <Col align="middle" span={16} className="title">
            <h1>랭킹</h1>
          </Col>
        </Row>
        <img
          src={rankingHeader}
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
              <Col xs={0} md={8} lg={5}>
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
                xs={0}
                md={3}
                style={{
                  marginLeft: "5px",
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
                    <Row align="center" style={{ paddingTop: "40px" }}>
                      <Col justify="center" align="center" className="profileBox">
                        <Row align="center" style={{ padding: "4px" }}>
                          <Col span={3}>
                            <p>MyRank</p>
                          </Col>
                          <Col span={1}>
                            <p>MyImg</p>
                          </Col>
                          <Col span={4}>
                            <p>MyName</p>
                          </Col>
                          <Col span={3}>
                            <p>MyLevel</p>
                          </Col>
                          <Col span={4}>
                            <p>MyMMR</p>
                          </Col>
                          <Col span={4}>
                            <p>MyTier</p>
                          </Col>
                          <Col span={3}>
                            <p>MyRecord</p>
                          </Col>
                        </Row>
                      </Col>
                    </Row>

                    {/* 랭커 순위 표시 */}
                    <Row justify="center">
                      <Col>
                        <h2>랭킹 정보</h2>
                      </Col>
                    </Row>
                    <Row justify="center">
                      <Col justify="center" span={24}>
                        {/* 랭커 정보 표시 */}
                        <ConfigProvider
                          theme={{
                            // algorithm : AntD에서 기본적으로 제공하는 다크 모드 테마
                            algorithm: theme.darkAlgorithm,
                            // token : AntD의 기본 색상 테마 설정(기존 : 파란색)
                            token: {
                              colorPrimary: "#FAC557",
                            },
                          }}>
                          <Table
                            style={{
                              padding: "3px",
                            }}
                            dataSource={problemData}
                            columns={problemLabel}
                            showHeader={false}
                            // expandable={{
                            //   innerRow,
                            //   defaultExpandedRowKeys: ["0"],
                            // }}
                            pagination={{
                              position: ["bottomCenter"],
                              defaultPageSize: 10,
                            }}
                          />
                        </ConfigProvider>
                      </Col>
                    </Row>
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
