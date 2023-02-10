import { Row, Col, ConfigProvider, Table, theme } from "antd";
import "./Mypage.css";
import settingIcon from "../../assets/setting.png";
import tempImg from "../../logo.svg";
import { useParams, Link } from "react-router-dom";
import { ResponsivePie } from "@nivo/pie";
import React, { useState, useEffect } from "react";
import { PieChart } from "react-minimal-pie-chart";

import goldBadge from "../../assets/ALCOL tiers/bigtier_gold.png";

// 현재 로그인한 사용자 정보
const userData = {
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
    dataIndex: "matchResult",
    key: "matchResult",
    align: "center",
  },
  {
    dataIndex: "playMode",
    title: "플레이 모드",
    align: "center",
    key: "playMode",
  },
  {
    dataIndex: "opponent",
    key: "opponent",
    title: "대결 상대",
    align: "center",
  },
  {
    dataIndex: "problemName",
    key: "problemName",
    title: "문제 이름",
    align: "center",
  },
  {
    dataIndex: "problemDifficulty",
    key: "problemDifficulty",
    title: "문제 난이도",
    align: "center",
  },
  {
    dataIndex: "recordDate",
    key: "recordDate",
    title: "일시",
    align: "center",
  },
];

// 매치 기록 데이터
const matchData = [
  {
    id: 1,
    playMode: "스피드",
    problemName: "Problem1",
    matchResult: "승리",
    opponent: "맥주",
    recordDate: "어제",
    problemDifficulty: "Diamond",
  },
  {
    id: 2,
    playMode: "스피드",
    problemName: "Problem2",
    matchResult: "승리",
    opponent: "소주",
    recordDate: "어제",
    problemDifficulty: "Diamond",
  },
  {
    id: 3,
    playMode: "스피드",
    problemName: "Problem3",
    matchResult: "승리",
    opponent: "막걸리",
    recordDate: "어제",
    problemDifficulty: "Diamond",
  },
  {
    id: 4,
    playMode: "스피드",
    problemName: "Problem4",
    matchResult: "승리",
    opponent: "와인",
    recordDate: "어제",
    problemDifficulty: "Diamond",
  },
  {
    id: 5,
    playMode: "스피드",
    problemName: "Problem5",
    matchResult: "승리",
    opponent: "고량주",
    recordDate: "어제",
    problemDifficulty: "Diamond",
  },
  {
    id: 6,
    playMode: "스피드",
    problemName: "Problem1",
    matchResult: "승리",
    opponent: "1번 플레이어",
    recordDate: "어제",
    problemDifficulty: "Diamond",
  },
  {
    id: 7,
    playMode: "스피드",
    problemName: "Problem2",
    matchResult: "승리",
    opponent: "2번 플레이어",
    recordDate: "어제",
    problemDifficulty: "Diamond",
  },
  {
    id: 8,
    playMode: "스피드",
    problemName: "Problem3",
    matchResult: "승리",
    opponent: "3번 플레이어",
    recordDate: "어제",
    problemDifficulty: "Diamond",
  },
  {
    id: 9,
    playMode: "스피드",
    problemName: "Problem4",
    matchResult: "승리",
    opponent: "4번 플레이어",
    recordDate: "어제",
    problemDifficulty: "Diamond",
  },
  {
    id: 10,
    playMode: "스피드",
    problemName: "Problem5",
    matchResult: "승리",
    opponent: "5번 플레이어",
    recordDate: "어제",
    problemDifficulty: "Diamond",
  },
  {
    id: 11,
    playMode: "스피드",
    problemName: "Problem1",
    matchResult: "승리",
    opponent: "플레이어 6",
    recordDate: "어제",
    problemDifficulty: "Diamond",
  },
  {
    id: 12,
    playMode: "스피드",
    problemName: "Problem2",
    matchResult: "승리",
    opponent: "플레이어 7",
    recordDate: "어제",
    problemDifficulty: "Diamond",
  },
  {
    id: 13,
    playMode: "스피드",
    problemName: "Problem3",
    matchResult: "승리",
    opponent: "플레이어 8",
    recordDate: "어제",
    problemDifficulty: "Diamond",
  },
  {
    id: 14,
    playMode: "스피드",
    problemName: "Problem4",
    matchResult: "승리",
    opponent: "플레이어 9",
    recordDate: "어제",
    problemDifficulty: "Diamond",
  },
  {
    id: 15,
    playMode: "스피드",
    problemName: "Problem5",
    matchResult: "승리",
    opponent: "플레이어 10",
    recordDate: "어제",
    problemDifficulty: "Diamond",
  },
];

// 스피드전 데이터
const speedData = [
  {
    value: 20,
    color: "#F6CB44",
    name: "name1",
  },
];

// 효율성전 데이터
const efficiencyData = [
  {
    value: 30,
    color: "#F6CB44",
    name: "name1",
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
  // URL 파라미터로 사용자 정보 가져오기
  const userInfo = useParams();
  // profile = 사용자 닉네임
  const profile = userData[userInfo.username];

  // 더 보기 단추
  // resultCount = 현재 몇 개의 전적 항목을 조회하는지 체크하는 용도
  const [resultCount, setResultCount] = useState(10);

  const dataLength = matchData.length;
  useEffect(() => {
    // 모든 데이터를 불러왔음에도 '더 보기'를 누르는 경우 알림
    if (resultCount - 10 >= dataLength) {
      alert("전적을 모두 불러왔습니다.");
    }
  });

  // 서버에서 전적을 한 번에 불러온 후 10개씩 표시
  const refinedData = matchData.slice(0, resultCount);

  return (
    <div
      className="pageBody"
      style={{
        backgroundColor: "#16171B",
        padding: "30px",
        height: "100%",
      }}>
      {profile ? (
        <div>
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
            <Col xs={16} lg={18} className="block">
              <Row>
                {/* 티어 정보 표시 블록 */}
                <Col span={24} justify="center" align="middle">
                  <Row justify="center" align="middle">
                    {/* 스피드전 티어 뱃지 */}
                    <Col
                      xs={12}
                      md={8}
                      xl={6}
                      justify="center"
                      style={{
                        margin: "15px",
                        maxHeight: "240px",
                      }}>
                      <PieChart
                        data={speedData}
                        reveal={speedData[0].value}
                        lineWidth={16}
                        lengthAngle={300}
                        background="#f3f3f3"
                        rounded
                        animate
                        startAngle={120}
                        className="tierGraph"
                        label={({ dataEntry }) => "G1"}
                        labelStyle={{
                          fontSize: "10px",
                          fill: "black",
                        }}
                        labelPosition={0}
                      />
                      <img
                        src={goldBadge}
                        alt="Badge"
                        className="tierBadge"
                        style={{
                          zIndex: "10",
                        }}
                      />
                    </Col>
                    {/* 스피드전 데이터 요약 */}
                    <Col xs={24} md={8} lg={8} xl={5} className="text">
                      <p>스피드전 요약</p>
                      <p>티어명</p>
                      <p>MMR</p>
                      <p>1000위(상위 20%)</p>
                    </Col>
                    {/* 최적화전 데이터 요약 */}
                    <Col xs={24} md={8} lg={8} xl={5} className="text">
                      <p>최적화전 요약</p>
                      <p>티어명</p>
                      <p>MMR</p>
                      <p>1000위(상위 20%)</p>
                    </Col>
                    {/* 최적화전 티어 뱃지 */}
                    <Col
                      xs={12}
                      md={8}
                      xl={6}
                      justify="center"
                      style={{
                        margin: "15px",
                        maxHeight: "240px",
                      }}>
                      <PieChart
                        data={efficiencyData}
                        reveal={efficiencyData[0].value}
                        lineWidth={16}
                        lengthAngle={300}
                        background="#f3f3f3"
                        rounded
                        animate
                        startAngle={120}
                        className="tierGraph"
                        label={({ dataEntry }) => "G1"}
                        labelStyle={{
                          fontSize: "10px",
                          fill: "black",
                        }}
                        labelPosition={0}
                      />
                      <img
                        src={goldBadge}
                        alt="Badge"
                        className="tierBadge"
                        style={{
                          zIndex: "10",
                        }}
                      />
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
                  enableArcLabels={false}
                  enableArcLinkLabels={false}
                  arcLabelsSkipAngle={10}
                  isInteractive={false}
                  layers={["arcs", "arcLabels", "arcLinkLabels", "legends", CenteredMetric]}
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
                      dataSource={refinedData}
                      columns={matchCol}
                      pagination={false}
                      rowkey="id"
                    />
                    <p onClick={() => setResultCount(resultCount + 10)}>더 보기</p>
                  </ConfigProvider>
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
            height: "400px",
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
