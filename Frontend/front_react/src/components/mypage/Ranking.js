import { Button, Row, Col, Input, Table, ConfigProvider, theme, Pagination, Form } from "antd";
import "./Ranking.css";
import rankingHeader from "../../assets/ranking_header.png";
import qs from "query-string";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { AccessTokenInfo, LoginState, RefreshTokenInfo } from "../../states/LoginState";
import { CurrentUserRankingState, RankerListState } from "../../states/RankingState";

// 랭커 정보 컬럼(실제 서비스에서는 표시하지 않음)
const rankingLabel = [
  {
    dataIndex: "grade",
    key: "id",
    title: "순위",
    align: "center",
    hidden: true,
    width: "5%",
  },
  {
    dataIndex: "profile_img",
    title: "Image",
    render: (profile_img) => ProfileImage(profile_img),
    width: "5%",
    hidden: true,
  },
  {
    dataIndex: "nickname",
    key: "nickname",
    title: "닉네임",
    align: "left",
    hidden: true,
    width: "20%",
  },
  {
    dataIndex: "level",
    key: "level",
    title: "LEVEL",
    align: "center",
    hidden: true,
    width: "15%",
  },
  {
    dataIndex: "mmr",
    key: "mmr",
    title: "MMR",
    align: "center",
    hidden: true,
    width: "15%",
  },
  {
    dataIndex: "tier",
    key: "tier",
    title: "시즌 티어",
    align: "center",
    hidden: true,
    width: "20%",
  },
  {
    dataIndex: "record",
    key: "record",
    title: "시즌 전적",
    align: "center",
    hidden: true,
  },
];

// 사진 데이터 관리 함수
function ProfileImage(urlSrc) {
  let photo = urlSrc;

  //화면에 프로필 사진 표시
  if (urlSrc) {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        photo = reader.result;
        reader.readAsDataURL(new Blob(urlSrc));
      }
    };
  } else {
    photo = `https://kimjusung-bucket.s3.ap-northeast-2.amazonaws.com/loofy.png`;
  }

  return (
    <img
      src={photo}
      alt="profile"
      style={{
        width: "32px",
        height: "32px",
        borderRadius: "100%",
      }}
    />
  );
}

// 사진이 없는 경우 기본 사진을 반환하는 용도
function isNew(picture) {
  // 기존 사진이 있는 경우
  if (picture) {
    return picture;
  }
  // 기존 사진이 없는 경우
  else {
    return `https://kimjusung-bucket.s3.ap-northeast-2.amazonaws.com/loofy.png`;
  }
}

// 페이지 렌더링 함수
function Ranking() {
  // URL에 입력된 파라미터 가져오기
  const paramInfo = qs.parse(window.location.search);
  const modeName = paramInfo.mode;
  const pageNo = Number(paramInfo.page);

  // 탭 선택 여부에 따라 스타일링
  const [speedColor, setSpeedColor] = useState({ color: "white" });
  const [efficiencyColor, setEfficiencyColor] = useState({ color: "white" });

  // 검색어 입력 관리
  const [search, setSearch] = useState("");

  // 검색어 입력 시 value(search)가 실시간으로 변경되도록 적용
  const inputChange = (event) => {
    event.preventDefault();
    setSearch(event.target.value);
  };

  // 탭 스타일 변경
  useEffect(() => {
    if (modeName === "speed") {
      setSpeedColor({ color: "#94D6FB" });
      setEfficiencyColor({ color: "white" });
    } else if (modeName === "optimization") {
      setEfficiencyColor({ color: "#94d6f8" });
      setSpeedColor({ color: "white" });
    }
  }, [modeName]);

  // 사용자 정보 기록
  const userId = useRecoilValue(LoginState);
  const accessTokenData = useRecoilValue(AccessTokenInfo);
  const refreshTokenData = useRecoilValue(RefreshTokenInfo);

  const [userData, setUserData] = useRecoilState(CurrentUserRankingState);

  // 사용자(본인) 정보: 사용자의 랭킹 정보 요청
  useEffect(() => {
    // 사용자 인증 정보 모음(액세스 토큰, 리프레시 토큰, 사용자 ID)
    const userAuth = {
      access_token: accessTokenData,
      refresh_token: refreshTokenData,
      user_id: userId,
    };
    // axios 요청(body: 모드, header: 사용자 인증 정보)
    axios
      .post(
        `http://i8b303.p.ssafy.io:8000/rank-service/myRank`,
        {
          battle_mode: modeName,
        },
        {
          headers: userAuth,
        }
      )
      .then((response) => {
        if (response.data.customCode === "000") {
          // 로그인한 사용자 데이터(userData) 설정
          const originData = response.data.bodyData;

          const winpoint = Number(originData.record.win);
          const losepoint = Number(originData.record.lose);
          const winrate =
            winpoint === 0 && losepoint === 0
              ? 0
              : Math.round((Number(winpoint) / (Number(winpoint) + Number(losepoint))) * 10000) /
                100;

          const originUserData = {
            grade: originData.grade,
            nickname: originData.nickname,
            profile_img: isNew(originData.profile_pic),
            mmr: originData.mmr,
            level: originData.level,
            tier: originData.tier,
            record: `${winpoint}승 ${losepoint}패(${winrate}%)`,
          };
          setUserData(originUserData);
        } else {
          setUserData([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [accessTokenData, refreshTokenData, userId, modeName, setUserData]);

  // 사용자 기록 표시
  function UserDisplay() {
    // recoil에서 사용자 정보 가져오기
    const userId = useRecoilValue(LoginState);

    // 사용자가 로그인하지 않은 경우
    if (!userId) {
      return (
        <Row align="center" style={{ padding: "4px" }}>
          <Col span={24} justify="center">
            <span>정보를 보려면 로그인하세요.</span>
          </Col>
        </Row>
      );
      // 로그인했지만 정보가 없는 경우
    } else if (!userData) {
      return (
        <Row align="center" style={{ padding: "4px" }}>
          <Col span={24} justify="center">
            <span>사용자 정보를 불러올 수 없습니다.</span>
          </Col>
        </Row>
      );
      // 로그인 한 상태에서 정보를 정상적으로 불러온 경우
    } else {
      return (
        <Row justify="center" align="middle" style={{ padding: "4px" }}>
          <Col span={3}>
            <p>순위</p>
            <p>{userData.grade}</p>
          </Col>
          <Col span={1}>
            <img
              src={userData.profile_img}
              alt="profile"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "100%",
              }}
            />
          </Col>
          <Col span={4}>
            <p>닉네임</p>
            <p>{userData.nickname}</p>
          </Col>
          <Col span={3}>
            <p>레벨</p>
            <p>{userData.level}</p>
          </Col>
          <Col span={4}>
            <p>MMR</p>
            <p>{userData.mmr}</p>
          </Col>
          <Col span={4}>
            <p>티어</p>
            <p>{userData.tier}</p>
          </Col>
          <Col span={3}>
            <p>전적</p>
            <p>{userData.record}</p>
          </Col>
        </Row>
      );
    }
  }

  // 랭커 목록
  const [rankerList, setRankerList] = useRecoilState(RankerListState);

  // 페이지네이션 정보: 페이지네이션 선택 시 해당 페이지 번호에 대응하는 URL로 이동 후 새로운 axios 요청 수행
  const [current, setCurrent] = useState(pageNo);

  // 첫 화면에 표시할 기본 정보: 파라미터를 바탕으로 서버에 랭커 정보 요청
  useEffect(() => {
    setCurrent(pageNo);
    // axios 통신 진행
    axios
      .get(
        `http://i8b303.p.ssafy.io:8000/rank-service/rankList?battle_mode=${modeName}&page=${pageNo}`
      )
      // 응답 성공 시
      .then(function (response) {
        // 랭킹 정보가 존재하는 경우
        if (response.data.customCode === "002") {
          // (대충 데이터 저장 후 화면에 표시해준다는 내용)
          const originData = response.data.bodyData;
          const rankerData = originData.map((data) => {
            // data.record(전적) 데이터가 없음(null)
            const winpoint = data.record.win ? Number(data.record.win) : 0;
            const losepoint = data.record.lose ? Number(data.record.lose) : 0;
            const winrate =
              winpoint === 0 && losepoint === 0
                ? 0
                : Math.round((Number(winpoint) / (Number(winpoint) + Number(losepoint))) * 10000) /
                  100;
            return {
              grade: data.grade,
              nickname: data.nickname,
              profile_img: data.profile_pic,
              mmr: data.mmr,
              level: data.level,
              tier: data.tier,
              record: `${data.record.win}승 ${data.record.lose}패(${winrate}%)`,
            };
          });
          // 랭커 정보를 recoil에 저장
          setRankerList(rankerData);
          window.scrollTo(0, 0);
        }
      })
      //응답 실패 시
      .catch((error) => {
        if (error.response.data.customCode === "003") {
          alert("해당 페이지에는 랭킹 정보가 없습니다.");
        }
        console.log("응답 실패 : " + error);
      });
  }, [modeName, pageNo, setRankerList]);

  // 페이지 이동 시(페이지네이션 선택 시)
  const pageMove = (page) => {
    setCurrent(page);
    window.location.assign(`/ranking?mode=${modeName}&page=${page}`);
  };

  // 스피드 랭킹 조회 시도 시
  const selectSpeed = () => {
    setCurrent(1);
    window.location.assign(`/ranking?mode=speed&page=1`);
  };
  // 최적화 랭킹 조회 시도 시
  const selectOptimization = () => {
    setCurrent(1);
    window.location.assign(`/ranking?mode=optimization&page=1`);
  };

  // 검색 정보: 유저 검색 시
  const onSearch = (values) => {
    const userNickname = values.keyword;
    // axios 통신 진행
    axios
      .get(
        `http://i8b303.p.ssafy.io:8000/rank-service/searchUser?battle_mode=${modeName}&nickname=${userNickname}`
      )
      // 응답 성공 시
      .then(function (response) {
        const dataBody = response.data.bodyData;
        const searchResponse = {
          grade: dataBody.grade,
          nickname: dataBody.nickname,
          profile_img: dataBody.profile_pic,
          mmr: dataBody.mmr,
          level: dataBody.level,
          tier: dataBody.tier,
          // record: `${dataBody.record.win}승 ${dataBody.record.lose}패(${dataBody.record.winningRate}%)`,
        };
        setRankerList([searchResponse]);
        // window.location.replace(`/ranking/search?mode=${modeName}&username=${dataBody.nickname}`);
      })
      //응답 실패 시
      .catch((error) => {
        alert("존재하지 않는 닉네임입니다.");
        console.log("응답 실패 : " + error);
      });
  };

  // 페이지 렌더링
  return (
    <div
      style={{
        paddingTop: "65px",
      }}>
      {/* 페이지 제목(이미지 위에 띄우기) */}
      <img src={rankingHeader} alt="headerImage" className="headerImg"></img>
      <h1 className="rankTitle">랭킹</h1>
      <Row justify="space-around" className="bodyBlock">
        <Col span={16}>
          {/* 검색 상자 */}
          <Form onFinish={onSearch}>
            <Row justify="end">
              <Col xs={8} md={6} lg={5}>
                <Form.Item name="keyword">
                  <Input
                    placeholder="닉네임으로 검색"
                    allowClear
                    onChange={inputChange}
                    size="middle"
                    value={search}
                    style={{
                      margin: "5px",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={0}
                md={3}
                style={{
                  marginLeft: "5px",
                  padding: "5px",
                }}>
                <Form.Item>
                  <Button htmlType="submit">검색</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          {/* 랭킹 표시 블록 */}
          <Row>
            <Col span={24}>
              <Row className="rankerBlock" justify="center" align="center">
                <Col span={24}>
                  {/* 토글 버튼 목록 */}
                  <Row className="select">
                    <Col span={12} style={{ cursor: "pointer" }}>
                      <span className="filterText" onClick={selectSpeed} style={speedColor}>
                        스피드
                      </span>
                    </Col>
                    <Col span={12} style={{ cursor: "pointer" }}>
                      <span
                        className="filterText"
                        onClick={selectOptimization}
                        style={efficiencyColor}>
                        최적화
                      </span>
                    </Col>
                  </Row>
                  <hr></hr>
                  <Row justify="center">
                    <Col>
                      <h2
                        style={{
                          paddingTop: "5px",
                        }}>
                        랭킹 정보
                      </h2>
                    </Col>
                  </Row>
                  {/* 내 랭킹 표시 */}
                  <Row align="center" style={{ padding: "10px", paddingBottom: "25px" }}>
                    <Col justify="center" align="center" className="profileBox">
                      <UserDisplay />
                    </Col>
                  </Row>

                  {/* 랭커 순위 표시 */}

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
                          dataSource={rankerList}
                          columns={rankingLabel}
                          showHeader={false}
                          pagination={false}
                        />
                        <Pagination
                          defaultCurrent={current}
                          onChange={pageMove}
                          total={(pageNo + 9) * 10}
                          showQuickJumper={false}
                          showSizeChanger={false}
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
  );
}

export default Ranking;
