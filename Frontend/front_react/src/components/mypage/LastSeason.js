import { Row, Col, Menu } from "antd";
import styles from "./LastSeason.module.css";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import noBadge from "../../assets/ALCOL_tiers/background.png";
import bronzeBadge from "../../assets/ALCOL_tiers/bigtier_bronze.png";
import silverBadge from "../../assets/ALCOL_tiers/bigtier_silver.png";
import goldBadge from "../../assets/ALCOL_tiers/bigtier_gold.png";
import platinumBadge from "../../assets/ALCOL_tiers/bigtier_platinum.png";
import diamondBadge from "../../assets/ALCOL_tiers/bigtier_diamond.png";
import alcolBadge from "../../assets/ALCOL_tiers/bigtier_alcol.png";

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [getItem("모두", "1"), getItem("스피드", "2"), getItem("최적화", "3")];

function LastSeason() {
  // 사용자 정보
  const userInfo = useParams();

  // 테스트용 더미 데이터
  const dummy = [
    {
      modeName: "스피드",
      seasonName: "season7",
      tierName: "Gold",
      ranking: "3201위",
    },
    {
      modeName: "최적화",
      seasonName: "season7",
      tierName: "Silver",
      ranking: "999위",
    },
    {
      modeName: "스피드",
      seasonName: "season6",
      tierName: "Gold",
      ranking: "599위",
    },
    {
      modeName: "스피드",
      seasonName: "season5",
      tierName: "Gold",
      ranking: "430위",
    },
    {
      modeName: "스피드",
      seasonName: "season4",
      tierName: "Silver",
      ranking: "552위",
    },
    {
      modeName: "스피드",
      seasonName: "season3",
      tierName: "Gold",
      ranking: "1999위",
    },
    {
      modeName: "최적화",
      seasonName: "season3",
      tierName: "Bronze",
      ranking: "1024위",
    },
  ];

  // 뱃지 정보 추가
  const badgeMap = dummy.map((data) => {
    if (data.tierName === "Bronze") {
      return { ...data, badge: bronzeBadge };
    } else if (data.tierName === "Silver") {
      return { ...data, badge: silverBadge };
    } else if (data.tierName === "Gold") {
      return { ...data, badge: goldBadge };
    } else if (data.tierName === "Platinum") {
      return { ...data, badge: platinumBadge };
    } else if (data.tierName === "Diamond") {
      return { ...data, badge: diamondBadge };
    } else if (data.tierName === "Alcol") {
      return { ...data, badge: alcolBadge };
    } else {
      return { ...data, badge: noBadge };
    }
  });

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
              <h1>{userInfo.username}님의 지난 시즌 이력</h1>
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
                height: "40%",
                padding: "10px",
              }}>
              <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" items={items} />

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
                {badgeMap.map((seasonData, key) => (
                  <Col span={24} align="middle" className={styles.seasonGrid}>
                    <Row align="middle">
                      <Col span={8} className={styles.text}>
                        <img
                          src={seasonData.badge}
                          alt="badge"
                          style={{
                            width: "80px",
                            height: "80px",
                          }}
                        />
                      </Col>
                      <Col span={8} className={styles.text}>
                        Winrategraph
                      </Col>
                      <Col span={8} className={styles.text}>
                        {/* 모드 이름 */}
                        <Row>
                          <Col>{seasonData.modeName}</Col>
                        </Row>

                        {/* 시즌 이름 */}
                        <Row>
                          <Col>{seasonData.seasonName}</Col>
                        </Row>

                        {/* 티어 이름 */}
                        <Row>
                          <Col>티어명</Col>
                        </Row>

                        {/* 마지막 랭킹 레이블 */}
                        <Row>
                          <Col>
                            <span>마지막 랭킹</span>
                          </Col>
                        </Row>

                        {/* 시즌 이름 */}
                        <Row>
                          <Col>{seasonData.ranking}</Col>
                        </Row>
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
