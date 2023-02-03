import { Button, Row, Col, Input } from "antd";
import "./Ranking.css";
import rankingHeader from "../../assets/ranking_header.png";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Pagination from "@mui/material/Pagination";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";

// 랭커 목록 다크 모드 적용
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

// 데이터 그리드 컬럼 가리기 옵션
const HideColumn = styled(DataGrid)(({ theme }) => ({
  "& .MuiDataGrid-columnHeaders": { display: "none" },
  "& .MuiDataGrid-virtualScroller": { marginTop: "0!important" },
}));

// 연습 문제 구분 설명
const problemLabel = [
  {
    field: "id",
    headerName: "순위",
    width: 100,
    flex: 0.6,
    align: "center",
    headerAlign: "center",
  },
  { field: "name", headerName: "ID", width: 200, flex: 1, align: "center", headerAlign: "center" },
  {
    field: "level",
    headerName: "LEVEL",
    width: 150,
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "mmr",
    headerName: "MMR",
    width: 150,
    flex: 0.7,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "tier",
    headerName: "시즌 티어",
    width: 190,
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "record",
    headerName: "시즌 전적",
    width: 200,
    flex: 1.3,
    align: "center",
    headerAlign: "center",
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
                      <Col span={24}>
                        {/* 랭커 정보 표시 */}
                        <ThemeProvider theme={darkTheme}>
                          <HideColumn
                            rows={problemData}
                            columns={problemLabel}
                            pageSize={10}
                            disableColumnSelector
                            disableColumnMenu
                            disableColumnFilter
                            autoHeight={true}
                            autoPageSize={true}
                            hideFooter={true}
                            style={{
                              borderBottomLeftRadius: "7%",
                              borderBottomRightRadius: "7%",
                            }}
                          />
                        </ThemeProvider>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                {/* 페이지네이션 표시 */}
                <Row justify="center">
                  <Col align="center">
                    <ThemeProvider theme={darkTheme}>
                      <Pagination
                        defaultCurrent={1}
                        total={50}
                        responsive="true"
                        className="pagiNation"
                      />
                    </ThemeProvider>
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
