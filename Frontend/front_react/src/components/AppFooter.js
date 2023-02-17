import { useLocation } from "react-router-dom";
import "./HeaderFooter.css";

// 푸터 영역
function AppFooter() {
  const locationNow = useLocation(); // 현재 접속 중인 URL 확인

  // 배틀 페이지에서는 헤더/푸터 제외하고 표시
  if (
    locationNow.pathname !== "/match" &&
    locationNow.pathname !== "/ban" &&
    locationNow.pathname !== "/mode" &&
    locationNow.pathname !== "/solve" &&
    locationNow.pathname !== "/solveprac" &&
    locationNow.pathname !== "/battle"
  )
    return (
      <footer className="footer">
        <h2 className="J6IX">J6IX</h2>
        <h3 className="textDark">SSAFY 공통 프로젝트</h3>
        <p className="textDark">이용약관</p>
        <p className="textDark">개인정보 처리방침</p>
        <p className="textDark">쿠키 설정</p>
        <p></p>
      </footer>
    );
}

export default AppFooter;
