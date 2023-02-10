import { Button, Row, Col, Input, Table, ConfigProvider, theme, Pagination } from "antd";
import "./Ranking.css";
import rankingHeader from "../../assets/ranking_header.png";
import qs from "query-string";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { LoginState } from "../../states/LoginState";
import { SearchResultState } from "../../states/RankingState";

// 랭커 정보 컬럼(실제 서비스에서는 표시하지 않음)
const rankingLabel = [
  {
    dataIndex: "grade",
    key: "id",
    title: "순위",
    align: "center",
    hidden: true,
  },
  {
    dataIndex: "nickname",
    key: "nickname",
    title: "닉네임",
    align: "center",
    hidden: true,
  },
  {
    dataIndex: "profile_img",
    title: "Image",
    render: (profile_img) => (
      <img
        src={profile_img}
        alt="profile"
        style={{
          width: "32px",
          height: "32px",
        }}
      />
    ),
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

function Ranking() {
  // URL에 입력된 파라미터 가져오기
  const paramInfo = qs.parse(window.location.search);
  const modeName = paramInfo.mode;

  // 파라미터 값 가져오기
  const keywordData = useParams();
  const userNickname = keywordData.username;

  // 탭 선택 여부에 따라 스타일링
  const [speedColor, setSpeedColor] = useState({ color: "white" });
  const [efficiencyColor, setEfficiencyColor] = useState({ color: "white" });
  const [levelColor, setLevelColor] = useState({ color: "white" });

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
      setLevelColor({ color: "white" });
    } else if (modeName === "efficiency") {
      setEfficiencyColor({ color: "#94d6f8" });
      setSpeedColor({ color: "white" });
      setLevelColor({ color: "white" });
    } else if (modeName === "level") {
      setSpeedColor({ color: "white" });
      setEfficiencyColor({ color: "white" });
      setLevelColor({ color: "#94d6f8" });
    }
  }, [modeName]);

  // 랭커 정보 기록

  // 사용자 정보 기록
  let userData = null;

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
      // 로그인 한 상태에서 정보를 정상적으로 불  러온 경우
    } else {
      return (
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
      );
    }
  }

  // 랭커 정보를 recoil에 저장
  const [result, setResult] = useRecoilState(SearchResultState);

  console.log(result);

  // 유저 검색 시
  // axios 통신 진행
  axios
    .get(
      `http://i8b303.p.ssafy.io:8000/searchUser?battle_mode=${modeName}&nickname=${userNickname}`
    )
    // 응답 성공 시
    .then(function (response) {
      console.log(response);
      // if (response.data.customCode === "002") {
      // }
      setResult();
    })
    //응답 실패 시
    .catch((error) => {
      console.log("응답 실패 : " + error);
    });

  // 페이지네이션 선택 시 해당 페이지 번호에 대응하는 URL로 이동 후 새로운 axios 요청 수행
  const [current, setCurrent] = useState(1);
  const pageMove = (page) => {
    setCurrent(page);
  };

  return (
    <div
      style={{
        paddingTop: "70px",
      }}>
      {/* 페이지 제목(이미지 위에 띄우기) */}
      <img src={rankingHeader} alt="headerImage" className="headerImg"></img>
      <h1 className="rankTitle">랭킹</h1>
      <Row justify="space-around" className="bodyBlock">
        <Col span={16}>
          {/* 검색 상자 */}
          <Row justify="end">
            <Col xs={8} md={6} lg={5}>
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
              <Row className="rankerBlock" justify="center" align="center">
                <Col span={24}>
                  {/* 토글 버튼 목록 */}
                  <Row className="select">
                    <Col span={8}>
                      <Link to="/ranking?mode=level&page=1" style={levelColor}>
                        <span className="filterText">레벨</span>
                      </Link>
                    </Col>
                    <Col span={8}>
                      <Link to="/ranking?mode=speed&page=1" style={speedColor}>
                        <span className="filterText">스피드</span>
                      </Link>
                    </Col>
                    <Col span={8}>
                      <Link to="/ranking?mode=efficiency&page=1" style={efficiencyColor}>
                        <span className="filterText">최적화</span>
                      </Link>
                    </Col>
                  </Row>
                  <hr></hr>

                  {/* 내 랭킹 표시 */}
                  <Row align="center" style={{ paddingTop: "40px" }}>
                    <Col justify="center" align="center" className="profileBox">
                      <UserDisplay />
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
                          dataSource={result}
                          columns={rankingLabel}
                          showHeader={false}
                          pagination={false}
                        />
                        <Pagination
                          defaultCurrent={current}
                          onChange={pageMove}
                          total={10}
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
