import { Button, Row, Col, Input, Table, ConfigProvider, theme, Form } from "antd";
import "./PracticePage.css";
import practiceHeader from "../../assets/practice_header.png";
import { Link } from "react-router-dom";
import { useState } from "react";

// 연습 문제 구분 설명
const problemLabel = [
  {
    title: "문제 번호",
    dataIndex: "problemNo",
    key: "problemNo",
    align: "center",
    render: (text, record) => <Link to={"/solveprac/" + record.key}>{text}</Link>,
  },
  {
    title: "문제 이름",
    dataIndex: "problemName",
    key: "problemNo",
    align: "center",
  },
  {
    title: "문제 유형",
    dataIndex: "problemType",
    key: "problemNo",
    align: "center",
  },
  {
    title: "문제 난이도",
    dataIndex: "problemDifficulty",
    key: "problemNo",
    align: "center",
  },
];

// 연습 문제 데이터
const problemData = [
  { key: 1, problemNo: "1", problemName: "문제1", problemType: "DFS", problemDifficulty: "Gold" },
  { key: 2, problemNo: "2", problemName: "문제2", problemType: "DFS", problemDifficulty: "Gold" },
  { key: 3, problemNo: "3", problemName: "문제3", problemType: "DFS", problemDifficulty: "Gold" },
  { key: 4, problemNo: "4", problemName: "문제4", problemType: "DFS", problemDifficulty: "Gold" },
  { key: 5, problemNo: "5", problemName: "문제5", problemType: "DFS", problemDifficulty: "Gold" },
];

// 페이지 렌더링
function Ranking() {
  // 데이터 상태 관리
  const [refinedData, setRefinedData] = useState(problemData);

  // 입력받은 검색어 상태 관리
  const [search, setSearch] = useState("");

  // 검색어 입력 시 value(search)가 실시간으로 변경되도록 적용
  const inputChange = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  // const refinedData = problemData.filter((problem) => problem.problemName.includes(query));
  const onSearch = (values) => {
    const searchInput = values.query;
    console.log(problemData);
    if (searchInput.trim()) {
      const filteredData = problemData.filter((problem) =>
        problem.problemName.includes(searchInput)
      );
      setRefinedData(filteredData);
    } else {
      setRefinedData(problemData);
    }
  };

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
            <Col xs={12} sm={8} justify="end">
              <Form onFinish={onSearch}>
                <Row>
                  <Col xs={12} lg={16}>
                    <Form.Item name="query">
                      <Input
                        onPressEnter={onSearch}
                        placeholder="문제 이름으로 검색"
                        allowClear
                        size="middle"
                        type="text"
                        value={search}
                        onChange={inputChange}
                        style={{
                          margin: "5px",
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    style={{
                      marginLeft: "5px",
                      padding: "5px",
                    }}
                    xs={3}
                    lg={6}>
                    <Form.Item>
                      <Button htmlType="submit">검색</Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>

          {/* 연습 문제 목록 블록(페이지네이션 포함) */}
          <Row className="block" justify="center" align="center">
            <Col className="problems" span={24} justify="center">
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
                  columns={problemLabel}
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
    </div>
  );
}

export default Ranking;
