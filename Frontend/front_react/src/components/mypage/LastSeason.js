import { Row, Col } from "antd";
import styles from "./LastSeason.module.css";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function LastSeason() {
  // 사용자 정보
  const userInfo = useParams();

  // 테스트용 더미 데이터
  const dummy = [
    "season1",
    "season2",
    "season3",
    "season4",
    "season5",
    "season6",
    "season7",
    "season8",
    "season9",
    "season10",
  ];

  return (
    <div>
      {userInfo ? (
        <div
          className={styles.pageBody}
          style={{
            backgroundColor: "#16171B",
            padding: "30px",
          }}>
          <Row justify="center">
            <Col span={21}>
              <h1>지난 시즌 이력</h1>
            </Col>
          </Row>
          <Row justify="center">
            {/* 필터 탭 블록 */}
            <Col
              xs={16}
              md={6}
              lg={4}
              className={styles.block}
              style={{
                height: "100px",
                padding: "10px",
              }}>
              {/* 전체 보기 탭 */}
              <Row className={styles.miniBlock}>
                <Col className={styles.innerText}>
                  <Link to="/modify">전체보기 </Link>
                </Col>
              </Row>

              {/* 스피드만 보기 탭 */}
              <Row className={styles.miniBlock}>
                <Col className={styles.innerText}>
                  <Link to="/modify">스피드 </Link>
                </Col>
              </Row>
              {/* 최적화만 보기 탭 */}
              <Row className={styles.miniBlock}>
                <Col className={styles.innerText}>
                  <Link to="/modify">최적화 </Link>
                </Col>
              </Row>
            </Col>

            {/* 지난 시즌 정보 표시 블록*/}
            <Col xs={16} lg={18} className={styles.block}>
              <Row style={{ padding: "10px" }}>
                {/* 한 줄에 3개씩 표시 */}
                {dummy.map((cardTitle, key) => (
                  <Col span={8} align="middle" className={styles.seasonGrid}>
                    <Row>
                      <Col span={8} className={styles.text}>
                        Tiergraph
                      </Col>
                      <Col span={8} className={styles.text}>
                        Winrategraph
                      </Col>
                      <Col span={8} className={styles.text}>
                        {cardTitle}
                      </Col>
                    </Row>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
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

export default LastSeason;
