import { Tooltip } from "antd";

function NotFound404() {
  return (
    <Tooltip title="유효하지 않은 주소일 수 있습니다.">
      <span
        style={{
          color: "white",
        }}>
        404 오류 : 페이지를 찾을 수 없습니다.
      </span>
    </Tooltip>
  );
}

export default NotFound404;
