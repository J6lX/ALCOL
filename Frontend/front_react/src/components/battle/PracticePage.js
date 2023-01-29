import { Button, Row, Col, Pagination, Input } from "antd";
import "./PracticePage.css";
import practiceHeader from "../../assets/practice_header.png";
// MaterialUI(MUI) 사용: 프레임워크 다운로드 필요
// npm install @mui/x-data-grid 입력하여 다운로드
import { DataGrid } from "@mui/x-data-grid";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// 문제 목록 다크 모드 적용
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

// 연습 문제 구분 설명
const problemLabel = [
  { field: "id", headerName: "문제 번호", width: 90, height: 200 },
  { field: "name", headerName: "문제 이름", width: 90, height: 200 },
  { field: "type", headerName: "문제 유형", width: 90, height: 200 },
  { field: "tier", headerName: "난이도", width: 90, height: 200 },
];

// 연습 문제 데이터
const problemData = [
  { id: 1, name: "문제1", type: "DFS", tier: "Gold" },
  { id: 2, name: "문제2", type: "BFS", tier: "Gold" },
  { id: 3, name: "문제3", type: "Greedy", tier: "Gold" },
  { id: 4, name: "문제4", type: "DFS", tier: "Gold" },
  { id: 5, name: "문제5", type: "DP", tier: "Gold" },
];

function Ranking() {
  return (
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

          {/* 연습 문제 목록 블록 */}
          <Row className="block" justify="center" align="center">
            <Col className="problems" span={24}>
              <ThemeProvider theme={darkTheme}>
                <DataGrid rows={problemData} columns={problemLabel} />
              </ThemeProvider>
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
    </div>
  );
}

export default Ranking;
