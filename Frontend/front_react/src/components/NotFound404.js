import { Row, Col } from "antd";

function NotFound404() {
  return (
    <Row
      justify="center"
      align="middle"
      style={{
        height: "200px",
      }}>
      <Col>
        <span
          style={{
            color: "white",
          }}>
          404 오류 : 페이지를 찾을 수 없습니다.
        </span>
      </Col>
    </Row>
  );
}

export default NotFound404;
