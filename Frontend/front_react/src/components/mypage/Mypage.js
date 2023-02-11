import { Row, Col, ConfigProvider, Table, theme } from "antd";
import "./Mypage.css";
import settingIcon from "../../assets/setting.png";
import tempImg from "../../logo.svg";
import { useParams, Link } from "react-router-dom";
import { ResponsivePie } from "@nivo/pie";
import React, { useState, useEffect } from "react";
import { PieChart } from "react-minimal-pie-chart";
import axios from "axios";

import bronzeBadge from "../../assets/ALCOL tiers/bigtier_bronze.png";
import silverBadge from "../../assets/ALCOL tiers/bigtier_silver.png";
import goldBadge from "../../assets/ALCOL tiers/bigtier_gold.png";
import { userBattleRec, UserInfoState } from "../../states/LoginState";
import { useRecoilState } from "recoil";

// 매치 기록 정렬 컬럼
const matchCol = [
  {
    title: "결과",
    dataIndex: "battle_result",
    key: "matchResult",
    align: "center",
  },
  {
    dataIndex: "battle_mode",
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
    dataIndex: "prob_name",
    key: "problemName",
    title: "문제 이름",
    align: "center",
  },
  {
    dataIndex: "prob_tier",
    key: "problemDifficulty",
    title: "문제 난이도",
    align: "center",
  },
  {
    dataIndex: "record_date",
    key: "recordDate",
    title: "일시",
    align: "center",
  },
];

// 뱃지 주기
function giveBadge(userTier) {
  if (userTier === "B") {
    return bronzeBadge;
  } else if (userTier === "S") {
    return silverBadge;
  } else if (userTier === "G") {
    return goldBadge;
  }
}

// 티어 별 색깔 주기
function giveColor(userTier) {
  if (userTier === "B") {
    return "#ec9e73";
  } else if (userTier === "S") {
    return "#e5edf8";
  } else if (userTier === "G") {
    return "#ecec63";
  } else if (userTier === "P") {
    return "#7aecbf";
  } else if (userTier === "D") {
    return "#5edfdf";
  } else if (userTier === "A") {
    return "#ec6385";
  } else {
    return "white";
  }
}

// 날짜 차이 계산 함수
function CalculateDatediff(startDate) {
  // datediffValue = 날짜 계산 차이 값(단위 : ms)
  const datediffValue = new Date() - new Date(startDate);

  // dateDivider = ms 단위를 일 단위로 환산하는 용도
  const dateDivider = 24 * 60 * 60 * 1000;
  // hourDivider = ms 단위를 시간 단위로 환산하는 용도
  const hourDivider = 60 * 60 * 1000;
  // minuteDivider = ms 단위를 분 단위로 환산하는 용도
  const minuteDivider = 60 * 1000;

  // dayValue = ms 단위를 일 단위로 변환한 값(버림)
  const dayValue = Math.floor(datediffValue / dateDivider);
  // hourValue = ms 단위를 시간 단위로 변환한 값(버림)
  const hourValue = Math.floor(datediffValue / hourDivider);
  // minuteValue = ms 단위를 분 단위로 변환한 값(버림)
  const minuteValue = Math.floor(datediffValue / minuteDivider);

  // dayValue가 1 이상이면 'n일 전'으로 반환
  if (dayValue > 0) {
    return `${dayValue}일 전`;
  }
  // 1일 이내인 경우 시간 단위로 계산
  else if (hourValue > 0) {
    return `${hourValue}시간 전`;
  }
  // 1시간 이내인 경우 분 단위로 계산
  else if (minuteValue > 5) {
    return `${hourValue}분 전`;
  }
  // 5분 이내인 경우 '방금'으로 처리
  else {
    return "방금";
  }
}

// 승/패 판단 함수
function IsVictory(result) {
  if (result === 1) {
    return "승리";
  } else {
    return "패배";
  }
}

// 페이지 렌더링 함수
function Mypage() {
  // 파라미터로 사용자 ID 가져오기
  const userId = useParams().username;

  // recoil에 사용자 정보 저장
  const [userInfo, setUserInfo] = useRecoilState(UserInfoState);
  const [battleRec, setBattleRec] = useRecoilState(userBattleRec);

  // 더 보기 단추
  // resultCount = 현재 몇 개의 전적 항목을 조회하는지 체크하는 용도
  const [resultCount, setResultCount] = useState(10);

  const dataLength = battleRec.length;
  useEffect(() => {
    // 모든 데이터를 불러왔음에도 '더 보기'를 누르는 경우 알림
    if (resultCount - 10 >= dataLength) {
      alert("전적을 모두 불러왔습니다.");
    }
  });

  // 서버에 마이페이지에 표시할 데이터 요청
  // 요청을 총 4번 해야 한다.
  // 1. 사용자 정보(/user-service/getUserInfo)
  // 2. 사용자의 전적(/user-service/getBattleLog)
  // 3. 지난 시즌 요약()
  // 4. 티어 정보

  useEffect(() => {
    const requestBody = { user_id: userId };

    axios
      .all([
        axios.post(`http://i8b303.p.ssafy.io:9000/user-service/getUserInfo`, requestBody),
        axios.post(`http://i8b303.p.ssafy.io:9000/user-service/getBattleLog`, requestBody),
      ])
      .then(
        axios.spread((originUserInfo, originBattleRecord) => {
          // 사용자 기본 정보를 recoil(userInfo)에 저장
          const originUserData = {
            nickname: originUserInfo.data.nickname,
            profileImg: originUserInfo.data.stored_file_name,
            level: originUserInfo.data.level,
            speedTier: originUserInfo.data.speed_tier,
            efficiencyTier: originUserInfo.data.optimization_tier,
          };
          setUserInfo(originUserData);
          // 사용자 전적을 recoil(userBattleRec)에 저장
          // 현재 지나치게 요청을 많이 하는 문제 발생 - 서버 터뜨리기 싫으면 useEffect()를 활용하자.
          const originBattleRec = originBattleRecord.data.map((record) => {
            return {
              battle_result: IsVictory(record.battle_result),
              battle_mode: record.battle_mode,
              opponent: record.other_user_nickname,
              prob_name: record.prob_name,
              prob_tier: record.prob_tier,
              record_date: CalculateDatediff(record.end_time),
            };
          });
          setBattleRec(originBattleRec);
        })
      )
      .catch((error) => {
        console.log(error);
      });
  }, [setBattleRec, setUserInfo, userId]);

  // 스피드 티어와 효율성 티어를 별도의 변수에 저장
  const userSPDTier = userInfo.speedTier.slice(0, 1);
  const userEFFTier = userInfo.efficiencyTier.slice(0, 1);

  // 서버에서 전적을 한 번에 불러온 후 10개씩 표시
  const refinedData = battleRec.slice(0, resultCount);

  // 그래프 표시용 정보
  const graphData = battleRec.slice(0, 20);
  // graphData의 정보 정제

  let wincount = 0;
  let losecount = 0;

  for (const recordCase of graphData) {
    if (recordCase.battle_result === "승리") {
      wincount++;
    } else {
      losecount++;
    }
  }

  // 최근 20전 표시 데이터(임시)
  const recentRecord = [
    {
      id: "win",
      label: "win",
      value: wincount,
      color: "#5cfdfd",
    },
    {
      id: "lose",
      label: "lose",
      value: losecount,
      color: "#FDE14B",
    },
  ];

  // 스피드전 데이터
  const speedData = [
    {
      value: 20,
      color: giveColor(userSPDTier),
      name: "name1",
    },
  ];

  // 효율성전 데이터
  const efficiencyData = [
    {
      value: 30,
      color: giveColor(userEFFTier),
      name: "name1",
    },
  ];

  // 그래프 중앙에 표시할 텍스트 레이블
  const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
    let total = 0;
    dataWithArc.forEach((datum) => {
      total += datum.value;
    });

    // 승 수, 패 수, 승률 표시
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

  return (
    <div
      className="pageBody"
      style={{
        backgroundColor: "#16171B",
        padding: "30px",
        height: "100%",
      }}>
      {userId ? (
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
                  <h1>{userInfo.nickname}</h1>
                </Col>
              </Row>
            </Col>

            {/* 티어 정보 및 뱃지 표시 블록*/}
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
                        src={giveBadge(userSPDTier)}
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
                        src={giveBadge(userEFFTier)}
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
