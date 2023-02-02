import Container from "react-bootstrap/Container";
import { Row, Col, Table } from "antd";
import "./Mypage.css";
import settingIcon from "../../assets/setting.png";
import tempImg from "../../logo.svg";
import { useParams, Link } from "react-router-dom";
import { ResponsivePie } from "@nivo/pie";

// 현재 로그인한 사용자 정보
const userData = {
  dongjun: {
    name: "Dongjun", // 이름
    battleRec: {}, // 전적
    friends: {}, // 친구 목록
  },
  tester: {
    name: "tester",
    battleRec: {},
    friends: {},
  },
};

// 매치 기록 정렬 컬럼
const matchCol = [
  {
    title: "결과",
    dataIndex: "name",
    key: "name",
    render: (text) => <p>{text}</p>,
  },
  {
    title: "플레이 모드",
    dataIndex: "mode",
    key: "mode",
  },
  {
    title: "상대 플레이어",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "문제 난이도",
    dataIndex: "difficulty",
    key: "difficulty",
  },
  {
    title: "기록일",
    dataIndex: "matchDate",
    key: "matchDate",
  },
];

// 매치 기록 데이터
const matchData = [
  {
    key: "1",
    name: "John Brown",
    mode: 32,
    address: "New York No. 1 Lake Park",
    difficulty: "Gold",
    matchDate: "1일 전",
  },
  {
    key: "2",
    name: "Jim Green",
    mode: 42,
    address: "London No. 1 Lake Park",
    difficulty: "Gold",
    matchDate: "1일 전",
  },
  {
    key: "3",
    name: "Joe Black",
    mode: 32,
    address: "Sidney No. 1 Lake Park",
    difficulty: "Gold",
    matchDate: "1일 전",
  },
];

// 최근 20전 표시 데이터(임시)
const recentRecord = [
  {
    id: "win",
    label: "win",
    value: 13,
    color: "#5cfdfd",
  },
  {
    id: "lose",
    label: "lose",
    value: 7,
    color: "#FDE14B",
  },
];

// 그래프 중앙에 표시할 텍스트 레이블
const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
  let total = 0;
  dataWithArc.forEach((datum) => {
    total += datum.value;
  });

  const win = recentRecord[0].value;
  const lose = recentRecord[1].value;
  const winrate = Math.round((win / total) * 100);
  // const innerText = {
  //   0: `최근 ${win+lose}전\n ${win}승 ${lose}패\n (${winrate}%)`
  // }

  return (
    <>
      <text
        x={centerX}
        y={centerY - 10}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        style={{
          fontFamily: "NanumSquareNeo",
          fontSize: "18px",
          fontWeight: 600,
          whiteSpace: "pre-line",
        }}>
        최근 {total} 전
      </text>
      <text
        x={centerX}
        y={centerY + 10}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        style={{
          fontFamily: "NanumSquareNeo",
          fontSize: "14px",
          fontWeight: 400,
          whiteSpace: "pre-line",
        }}>
        {win}승 {lose}패
      </text>
      <text
        x={centerX}
        y={centerY + 28}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#fde14b"
        style={{
          fontFamily: "NanumSquareNeo",
          fontSize: "12px",
          fontWeight: 300,
          whiteSpace: "pre-line",
        }}>
        ({winrate}%)
      </text>
    </>
  );
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
          {/* Container 태그 내 4개 블록으로 분리 */}
          <Container>
            {/* 사용자 프로필 블록 */}
            <Row
              justify="center"
              style={{
                padding: "5px",
              }}>
              <Col xs={16} md={6} lg={4} className="text block">
                {/* 설정 아이콘 표시 블록 */}
                <Row>
                  <Col md={{ offset: 21 }}>
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
              <Col xs={16} lg={18} className="textHighlight block">
                <Row>
                  {/* 티어 정보 표시 블록 */}
                  <Col span={24} justify="center" align="middle">
                    <Row justify="center">
                      {/* 스피드전 티어 뱃지 */}
                      <Col span={6} justify="center">
                        <img src={tempImg} alt="프사" className="userImg"></img>
                      </Col>
                      {/* 최적화전 티어 뱃지 */}
                      <Col span={6} justify="center">
                        <img src={tempImg} alt="프사" className="userImg"></img>
                      </Col>
                    </Row>
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
                xs={16}
                md={6}
                lg={4}
                align="middle"
                style={{
                  margin: "10px",
                }}>
                <Row
                  justify="center"
                  style={{
                    paddingBottom: "15px",
                  }}>
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
                    <hr />
                    <p className="textHighlight">시즌 기록 없음</p>
                    <hr />
                    {/* 지난 시즌 이력 조회 링크 */}
                    <Link to={`/season/${userInfo.username}`}>
                      <p className="textHighlight">지난 시즌 조회</p>
                    </Link>
                  </Col>
                </Row>
              </Col>

              {/* 전적 정보 표시 블록 */}
              <Col xs={16} lg={18} className="textHighlight block">
                {/* 필터 블록(모두/스피드전/효율성전 선택 버튼) */}
                <Row justify="space-around" className="modeFilter">
                  <Col sm={4} lg={4}>
                    <h4>모두</h4>
                  </Col>
                  <Col sm={4} lg={4}>
                    <h4>스피드전</h4>
                  </Col>
                  <Col sm={4} lg={4}>
                    <h4>최적화전</h4>
                  </Col>
                </Row>

                {/* 도넛 그래프 블록(최근 20전) */}
                <Row justify="center" style={{ height: "270px" }}>
                  <ResponsivePie
                    data={recentRecord}
                    margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    colors={["#5cfdfd", "#FDE14B"]}
                    colorBy="index"
                    borderWidth={1}
                    borderColor={{ theme: "background" }}
                    enableArcLinkLabels={false}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: "color" }}
                    arcLabelsSkipAngle={10}
                    layers={["arcs", "arcLabels", "arcLinkLabels", "legends", CenteredMetric]}
                    arcLabelsTextColor={{
                      from: "color",
                      modifiers: [["darker", 2]],
                    }}
                    fill={[
                      {
                        match: {
                          id: "win",
                        },
                      },
                      {
                        match: {
                          id: "lose",
                        },
                      },
                    ]}
                    legends={[]}
                  />
                </Row>
                {/* 전적 표시 블록 */}
                <Row>
                  <Col span={24}>
                    <Table theme="dark" columns={matchCol} dataSource={matchData} />
                  </Col>
                </Row>
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
