import { Row, Col } from "antd";
import { Link } from "react-router-dom";

function NotFound404() {
  return (
    <Row
      justify="center"
      align="middle"
      style={{
        height: "500px",
      }}>
      <Col align="center">
        <h1>404 Error</h1>
        <span
          style={{
            color: "white",
          }}>
          페이지를 찾을 수 없습니다.
        </span>
        <br />
        <Link to="/">
          <p>메인 화면으로</p>
        </Link>
      </Col>
    </Row>
  );
}

export default NotFound404;
