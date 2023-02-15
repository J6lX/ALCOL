import { Row, Col, ConfigProvider, Table, theme } from "antd";
import "./Mypage.css";
import { useParams, Link } from "react-router-dom";
import { ResponsivePie } from "@nivo/pie";
import React, { useState, useEffect, useRef } from "react";
import { PieChart } from "react-minimal-pie-chart";
import axios from "axios";

import noBadge from "../../assets/X.png";
import bronzeBadge from "../../assets/ALCOL_tiers/bigtier_bronze.png";
import silverBadge from "../../assets/ALCOL_tiers/bigtier_silver.png";
import goldBadge from "../../assets/ALCOL_tiers/bigtier_gold.png";
import platinumBadge from "../../assets/ALCOL_tiers/bigtier_platinum.png";
import diamondBadge from "../../assets/ALCOL_tiers/bigtier_diamond.png";
import alcolBadge from "../../assets/ALCOL_tiers/bigtier_alcol.png";

import {
  LoginState,
  BackupBattleRec,
  userBattleRec,
  UserInfoState,
  MMRState,
} from "../../states/LoginState";
import { LastSeasonState } from "../../states/RankingState";
import { useRecoilState, useRecoilValue } from "recoil";

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
    render: (record_date) => CalculateDatediff(record_date),
  },
];

// 뱃지 할당
function giveBadge(userTier) {
  if (userTier === "B") {
    return bronzeBadge;
  } else if (userTier === "S") {
    return silverBadge;
  } else if (userTier === "G") {
    return goldBadge;
  } else if (userTier === "P") {
    return platinumBadge;
  } else if (userTier === "D") {
    return diamondBadge;
  } else if (userTier === "A") {
    return alcolBadge;
  } else {
    return noBadge;
  }
}

// 티어 별 색상 할당
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

// 티어 기준선 계산
function TierBorder(tiercolor, tiernum) {
  // startingPoint = 시작 지점(티어 색상)
  const startingPoint = () => {
    // 브론즈면 800
    if (tiercolor === "B") {
      return 1000;
    }
    // 실버면 1150
    else if (tiercolor === "S") {
      return 1150;
    }
    // 골드면 1500
    else if (tiercolor === "G") {
      return 1500;
    }
    // 플래면 1850
    else if (tiercolor === "P") {
      return 1850;
    }
    // 다이아면 2200
    else if (tiercolor === "D") {
      return 2200;
    }
    // ALCOL이면 2750
    else if (tiercolor === "A") {
      return 2750;
    }
    // 무배치면 0
    else {
      return 0;
    }
  };
  // 최종 티어 경계 = 시작 지점 + 75 * 티어 숫자(단, 브5는 0)
  if (tiercolor === "B" && Number(tiernum) === 5) {
    return 0;
  } else {
    return startingPoint(tiercolor) + 75 * (5 - tiernum);
  }
}

// 날짜 값(value) 계산 함수
function GetDateDiffValue(startDate) {
  return new Date() - new Date(startDate);
}

// 날짜 차이 계산 함수
function CalculateDatediff(datediffValue) {
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

// 모드명 한글화(표시용)
function translateModeName(mode) {
  if (mode === "optimization") {
    return "최적화";
  } else {
    return "스피드";
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

// 사진 데이터 관리 함수
function ProfileImage() {
  // 서버에 저장되어있던 사용자의 프로필 사진 가져오기
  const userId = useRecoilValue(LoginState);
  const [userInfo, setUserInfo] = useRecoilState(UserInfoState);
  const [photo, setPhoto] = useState(userInfo.profileImg);

  const fileInput = useRef(null);
  const onChange = (e) => {
    const uploadFile = e.target.files[0];
    if (uploadFile) {
      //사진을 선택했을때
      setPhoto(uploadFile);
      //서버로 전송하는 형식 설정
      let formData = new FormData();
      // const userIdForUpload = new Blob(userId);
      formData.append("file", uploadFile);
      const userData = JSON.stringify({
        userId: userId,
      });
      formData.append("userUpdateDto", new Blob([userData], { type: "application/json" }));

      // 서버로 선택한 파일 보내기
      axios
        .put(`http://i8b303.p.ssafy.io:9000/user-service/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          if (response.data.custom_code === "007") {
            alert("수정 완료되었습니다.");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      //취소했을때
      setPhoto(photo);
      return;
    }
    // recoil에 저장된 userInfo중 사진 정보만 업데이트

    //화면에 프로필 사진 표시
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPhoto(reader.result);
        setUserInfo({
          nickname: userInfo.nickname,
          profileImg: reader.result,
          level: userInfo.level,
          speedTier: userInfo.speedTier,
          efficiencyTier: userInfo.efficiencyTier,
        });
      }
    };
    reader.readAsDataURL(uploadFile);
  };

  //화면에 프로필 사진 표시
  const reader = new FileReader();
  if (!fileInput) {
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPhoto(reader.result);
        setUserInfo({
          nickname: userInfo.nickname,
          profileImg: reader.result,
          level: userInfo.level,
          speedTier: userInfo.speedTier,
          efficiencyTier: userInfo.efficiencyTier,
        });
        reader.readAsDataURL(photo);
      }
    };
  }

  console.log("마이페이지 사진:", photo);

  return (
    <div className="mypage_useImg_box">
      <img
        src={photo}
        alt="profile_image"
        className="mypage_userImg"
        onClick={() => {
          fileInput.current.click();
        }}
      />
      <input
        type="file"
        style={{ display: "none" }}
        accept="image/jpg, image/png, image/jpeg"
        name="profile_img"
        onChange={onChange}
        ref={fileInput}
      />
    </div>
  );
}

// 페이지 렌더링 함수
function Mypage() {
  // 파라미터로 사용자 ID 가져오기
  const userId = useParams().username;

  // recoil에 마이페이지에 표시할 정보 저장
  const [userInfo, setUserInfo] = useRecoilState(UserInfoState);
  const [battleRec, setBattleRec] = useRecoilState(userBattleRec);
  const [BackupRec, setBackupRec] = useRecoilState(BackupBattleRec);
  const [seasonInfo, setSeasonInfo] = useRecoilState(LastSeasonState);
  const [MMRList, setMMRList] = useRecoilState(MMRState);

  // 더 보기 단추
  // resultCount = 현재 몇 개의 전적 항목을 조회하는지 체크하는 용도
  const [resultCount, setResultCount] = useState(10);

  // 마이페이지에 표시할 정보 요청
  // 요청을 총 4번 해야 한다.
  // 1. 사용자 정보(/user-service/getUserInfo)
  // 2. 사용자의 전적(/user-service/getBattleLog)
  // 3. 지난 시즌 요약()
  useEffect(() => {
    const requestBody = { user_id: userId };

    axios
      .all([
        axios.post(`http://i8b303.p.ssafy.io:9000/user-service/getUserInfo`, requestBody),
        axios.post(`http://i8b303.p.ssafy.io:9000/user-service/getBattleLog`, requestBody),
        axios.post(`http://i8b303.p.ssafy.io:9005/log-service/getPastSeasonLog`, requestBody),
      ])
      .then(
        axios.spread((originUserInfo, originBattleRecord, originLastSeason) => {
          // 사용자 기본 정보를 recoil(userInfo)에 저장할 수 있게 정제
          const originUserData = {
            nickname: originUserInfo.data.nickname,
            profileImg: originUserInfo.data.stored_file_name,
            level: originUserInfo.data.level,
            speedTier: originUserInfo.data.speed_tier,
            efficiencyTier: originUserInfo.data.optimization_tier,
          };
          setUserInfo(originUserData);

          // 사용자 전적을 recoil(userBattleRec)에 저장할 수 있게 정제
          // 지나치게 요청을 많이 하는 현상 발생 - 서버 터뜨리기 싫으면 useEffect()를 활용하자.
          const originBattleRec = originBattleRecord.data.map((record) => {
            return {
              battle_result: IsVictory(record.battle_result),
              battle_mode: translateModeName(record.battle_mode),
              opponent: record.other_user_nickname,
              prob_name: record.prob_name,
              prob_tier: record.prob_tier,
              // 기록일(record_date는 datediffValue로 받기)
              record_date: GetDateDiffValue(record.end_time),
            };
          });

          // originBattleRec 배열을 날짜 값 기준으로 오름차순 정렬
          originBattleRec.sort(function (case1, case2) {
            return case1.record_date - case2.record_date;
          });

          // 사용자의 지난 시즌 정보를 recoil(LastSeasonState)에 저장할 수 있게 정제
          const lastSeasonData = originLastSeason.data;
          const refinedLastSeason = lastSeasonData.map((record) => {
            return {
              modeName: translateModeName(record.battle_mode),
              season: record.season,
              tier: record.tier,
              ranking: record.ranking,
              win: record.win_cnt,
              lose: record.lose_cnt,
              winrate: Math.round((record.win_cnt / (record.win_cnt + record.lose_cnt)) * 100),
            };
          });

          // 시즌 정보를 시즌 값 기준으로 오름차순 정렬
          refinedLastSeason.sort(function (seasonA, seasonB) {
            return seasonA.season - seasonB.season;
          });

          // 정제한 정보들을 recoil에 반영
          setBattleRec(originBattleRec);
          setBackupRec(originBattleRec);
          setSeasonInfo(refinedLastSeason);
        })
      )
      .catch((error) => {
        console.log(error);
      });
  }, [setBattleRec, setUserInfo, setBackupRec, userId, setSeasonInfo]);

  // 스피드 티어와 효율성 티어를 별도의 변수에 저장
  // 사용자 정보가 없는 경우 공백을 슬라이싱 시도하는 문제 발생
  const userSPDTier = userInfo.speedTier.slice(0, 1);
  const userSPDnumber = userInfo.speedTier.slice(
    userInfo.speedTier.length - 1,
    userInfo.speedTier.length
  );

  const userEFFTier = userInfo.efficiencyTier.slice(0, 1);
  const userEFFnumber = userInfo.efficiencyTier.slice(
    userInfo.efficiencyTier.length - 1,
    userInfo.efficiencyTier.length
  );

  // 서버에서 전적을 한 번에 불러온 후 10개씩 표시
  const refinedData = battleRec.slice(0, resultCount);

  // 그래프 표시용 정보 정제
  const graphData = battleRec.slice(0, 20);
  let wincount = 0;
  let losecount = 0;

  // 정제된 정보를 바탕으로 승리 수와 패배 수 집계
  for (const recordCase of graphData) {
    if (recordCase.battle_result === "승리") {
      wincount++;
    } else {
      losecount++;
    }
  }

  // 최근 20전 표시 데이터
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

  // mmr 요청
  useEffect(() => {
    axios
      .post(`http://i8b303.p.ssafy.io:9005/log-service/getExpAndMmr`, null, {
        params: {
          user_id: userId,
        },
      })
      // 스피드전 MMR과 효율성전 MMR 반환
      .then((response) => {
        const mmrSrc = response.data;
        const speedMMR = mmrSrc.speedMmr;
        const efficiencyMMR = mmrSrc.optimizationMmr;
        // mmr 정보 저장
        setMMRList([speedMMR, efficiencyMMR]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userId, setMMRList]);

  // 모드 별 티어 시작점 구하기
  const speedBorder = TierBorder(userSPDTier, userSPDnumber);
  const efficiencyBorder = TierBorder(userEFFTier, userEFFnumber);

  // 모드 별 현재 MMR
  const spdMMR = MMRList[0];
  const effMMR = MMRList[1];

  // 스피드전 데이터
  const speedData = [
    {
      value: (spdMMR - speedBorder) * 2,
      color: giveColor(userSPDTier),
      name: "name1",
    },
  ];

  // 효율성전 데이터
  const efficiencyData = [
    {
      value: (effMMR - efficiencyBorder) * 2,
      color: giveColor(userEFFTier),
      name: "name1",
    },
  ];

  // 모드 선택에 따라 필터링 및 탭 스타일 변경 진행
  const [speedColor, setSpeedColor] = useState({ color: "white" });
  const [efficiencyColor, setEfficiencyColor] = useState({ color: "white" });
  const [levelColor, setLevelColor] = useState({ color: "white" });
  const [modeName, setModeName] = useState("level");
  // 필터링
  // 백업 리코일에 저장한 원본 값으로 롤백
  const setLevel = () => {
    setModeName("level");
    setBattleRec(BackupRec);
  };

  // 테이블에 표시할 데이터를 스피드 모드를 기준으로 필터링
  const setSpeed = () => {
    setModeName("speed");
    const filteredData = BackupRec.filter((data) => data.battle_mode === "스피드");
    setBattleRec(filteredData);
  };

  // 테이블에 표시할 데이터를 최적화 모드를 기준으로 필터링
  const setEfficiency = () => {
    setModeName("efficiency");
    const filteredData = BackupRec.filter((data) => data.battle_mode === "최적화");
    setBattleRec(filteredData);
  };

  // 탭 스타일 변경
  useEffect(() => {
    if (modeName === "speed") {
      setSpeedColor({ color: "#94D6FB" });
      setEfficiencyColor({ color: "white" });
      setLevelColor({ color: "white" });
    } else if (modeName === "efficiency") {
      setEfficiencyColor({ color: "#94d6f8" });
      setSpeedColor({ color: "white", textAlign: "center" });
      setLevelColor({ color: "white", textAlign: "center" });
    } else if (modeName === "level") {
      setSpeedColor({ color: "white", textAlign: "center" });
      setEfficiencyColor({ color: "white", textAlign: "center" });
      setLevelColor({ color: "#94d6f8", textAlign: "center" });
    }
  }, [modeName]);

  // 그래프 중앙에 표시할 텍스트 레이블
  const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
    let total = 0;
    dataWithArc.forEach((datum) => {
      total += datum.value;
    });

    // 승 수, 패 수, 승률 표시
    const win = recentRecord[0].value;
    const lose = recentRecord[1].value;
    const winrate = win + lose > 0 ? Math.round((win / total) * 100) : 0;

    // 컴포넌트 반환
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

  // 지난 시즌 요약 표시
  function SeasonCollection() {
    if (seasonInfo === []) {
      return <p>시즌 정보가 없습니다.</p>;
    } else {
      return (
        <>
          {/* 한 줄에 1개씩 표시 */}
          {seasonInfo.map((seasonData) => (
            // <Col span={24} align="middle" className="seasonGrid">
            <Col span={24} align="middle">
              <Row justify="center" align="middle">
                {/* <Col span={8} className="text"> */}
                <Col span={8}>
                  <img
                    src={giveBadge(seasonData.tier.slice(0, 1))}
                    alt="badge"
                    style={{
                      width: "120%",
                      height: "120%",
                    }}
                  />
                </Col>
                <Col xs={22} xl={14} className="text" style={{ marginLeft: "10px" }}>
                  {/* 모드 이름 */}
                  {/* <Row justify="center">
                    <Col>
                      <p style={{ fontSize: "13px" }} className="mypage_tier_small_font">
                        {seasonData.modeName}
                      </p>
                    </Col>
                  </Row> */}
                  {/* 시즌 이름 */}
                  <Row justify="center">
                    <Col>
                      <div
                        style={{ fontWeight: "lighter", fontSize: "13px" }}
                        className="mypage_tier_bold_font">
                        시즌 {seasonData.season} {seasonData.modeName}
                      </div>
                    </Col>
                  </Row>
                  {/* 시즌 이름 */}
                  {/* <Row justify="center">
                    <Col>
                      <p
                        style={{ fontWeight: "lighter", marginBottom: "-5px", marginTop: "-10px" }}
                        className="mypage_tier_detail_font">
                        {" "}
                        시즌 {seasonData.season}
                      </p>
                    </Col>
                  </Row> */}
                  {/* 티어 이름 */}
                  <Row justify="center">
                    <Col>
                      <p className="mypage_record_tier_font">{seasonData.tier}</p>
                    </Col>
                  </Row>
                  {/* 마지막 랭킹 레이블 */}
                  <Row justify="center">
                    <Col>
                      <p
                        style={{ fontWeight: "lighter", marginTop: "-5px" }}
                        className="mypage_tier_small_font">
                        {seasonData.ranking}위
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <hr />
            </Col>
          ))}
        </>
      );
    }
  }

  // 페이지 렌더링
  return (
    <div
      className="pageBody"
      style={{
        backgroundColor: "#16171B",
        padding: "30px",
        height: "100%",
      }}>
      <div
        style={{
          color: "white",
          fontFamily: "NanumSquareNeo",
          fontSize: "30px",
          marginLeft: "70px",
          marginBottom: "10px",
        }}>
        마이페이지
      </div>
      {userId ? (
        <div>
          {/* 사용자 프로필 블록 */}
          <Row
            className="mypage_first_row_wrap_box"
            justify="center"
            // style={{
            //   padding: "5px",
            // }}>
          >
            {/* 개인 정보 표시 블록 */}
            <Col
              xs={16}
              md={6}
              lg={4}
              // className="text block"
              // className="text mypage_profile_block"
              className="mypage_text mypage_profile_block"
              style={{
                display: "flex",
                justifyContent: "center",
              }}>
              {/* > */}
              <Row type="flex" align="middle">
                <Col>
                  {/* 이미지를 정상적으로 불러올 수 없는 경우 대체 이미지가 납작하게 표시되는 현상 발생 중 */}
                  <ProfileImage />
                  <h1>{userInfo.nickname}</h1>
                  <div style={{ color: "white", marginTop: "-10px" }}>LV. {userInfo.level}</div>
                </Col>
              </Row>
            </Col>

            {/* 티어 정보 및 뱃지 표시 블록*/}
            {/* <Col xs={16} lg={18} className="block"> */}
            <Col xs={16} lg={18} className="mypage_tier_wrap_box">
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
                        // margin: "15px",
                        maxHeight: "240px",
                      }}>
                      {/* 스피드전 진척도 그래프 */}
                      <PieChart
                        data={speedData}
                        reveal={speedData[0].value}
                        lineWidth={8}
                        lengthAngle={300}
                        background="#f3f3f3"
                        radius={45}
                        rounded
                        animate
                        startAngle={120}
                        className="tierGraph"
                        label={({ dataEntry }) =>
                          userSPDTier === "A" ? `${userSPDTier}` : `${userSPDTier}${userSPDnumber}`
                        }
                        labelStyle={{
                          fontSize: "10px",
                          fill: "black",
                        }}
                        labelPosition={0}
                        style={{
                          zIndex: "8",
                        }}
                      />
                      <img
                        src={giveBadge(userSPDTier)}
                        alt="Badge"
                        className="tierBadge"
                        style={{
                          zIndex: "7",
                        }}
                      />
                    </Col>
                    {/* 스피드전 데이터 요약 */}
                    <Col xs={24} md={8} lg={8} xl={5} className="text">
                      <p className="mypage_tier_bold_font" style={{ marginBottom: "20px" }}>
                        스피드전 요약
                      </p>
                      <p
                        className="mypage_tier_small_font"
                        style={{ fontWeight: "lighter", fontSize: "12px" }}>
                        MMR {spdMMR}
                      </p>
                      <p className="mypage_tier_large_font">{userInfo.speedTier}</p>
                      {/* <p className="mypage_tier_small_font">1000위(상위 20%)</p> */}
                      <p className="mypage_tier_detail_font">
                        다음 티어까지 {speedData[0].value}% 달성
                      </p>
                    </Col>
                    {/* 최적화전 데이터 요약 */}
                    <Col xs={24} md={8} lg={8} xl={5} className="text">
                      <p className="mypage_tier_bold_font" style={{ marginBottom: "20px" }}>
                        최적화전 요약
                      </p>
                      <p
                        className="mypage_tier_small_font"
                        style={{ fontWeight: "lighter", fontSize: "12px" }}>
                        MMR {effMMR}
                      </p>
                      <p className="mypage_tier_large_font">{userInfo.efficiencyTier}</p>
                      {/* <p className="mypage_tier_small_font">1000위(상위 20%)</p> */}
                      <p className="mypage_tier_detail_font">
                        다음 티어까지 {efficiencyData[0].value}% 달성
                      </p>
                    </Col>
                    {/* 최적화전 티어 뱃지 */}
                    <Col
                      xs={12}
                      md={8}
                      xl={6}
                      justify="center"
                      style={{
                        zindex: "8",
                        margin: "15px",
                        maxHeight: "240px",
                      }}>
                      <PieChart
                        data={efficiencyData}
                        reveal={efficiencyData[0].value}
                        lineWidth={8}
                        lengthAngle={300}
                        background="#f3f3f3"
                        radius={45}
                        rounded
                        animate
                        startAngle={120}
                        className="tierGraph"
                        label={({ dataEntry }) =>
                          userEFFTier === "A" ? `${userEFFTier}` : `${userEFFTier}${userEFFnumber}`
                        }
                        labelStyle={{
                          fontSize: "10px",
                          fill: "black",
                        }}
                        labelPosition={0}
                        style={{
                          zIndex: "8",
                        }}
                      />
                      <img
                        src={giveBadge(userEFFTier)}
                        alt="Badge"
                        className="tierBadge"
                        style={{
                          zIndex: "7",
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* 지난 시즌, 전적 표시 */}
          {/* <Row justify="center" className="mypage_second_row_wrap_box"> */}
          <Row justify="center" className="mypage_second_row_wrap_box">
            <Col
              xs={16}
              md={6}
              lg={4}
              // align="middle"
              style={{
                marginTop: "10px",
                marginRight: "10px",
              }}>
              {/* > */}
              <Row>
                {/* 지난 시즌 기록 보기 */}
                {/* <Col xs={24} className="miniBlock"> */}
                <Col xs={24} className="mypage_record_block">
                  <p className="textHighlight">지난 시즌 기록</p>
                  <hr />
                  <Row style={{ padding: "10px" }}>
                    {/* <Row> */}
                    <SeasonCollection />
                  </Row>
                </Col>
              </Row>
            </Col>

            {/* 전적 정보 표시 블록 */}
            {/* <Col xs={16} lg={18} className="textHighlight block"> */}
            <Col xs={16} lg={18} className="mypage_record_wrap_box">
              {/* 필터 블록(모두/스피드전/효율성전 선택 버튼) */}
              <Row justify="space-around" className="modeFilter">
                <Col sm={4} lg={4}>
                  <h4 style={levelColor} onClick={setLevel} className="mypage_text_center">
                    모두
                  </h4>
                </Col>
                <Col sm={4} lg={4}>
                  <h4 style={speedColor} onClick={setSpeed}>
                    스피드전
                  </h4>
                </Col>
                <Col sm={4} lg={4}>
                  <h4 style={efficiencyColor} onClick={setEfficiency}>
                    최적화전
                  </h4>
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
