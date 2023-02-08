import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { LoginState } from "./states/LoginState";

export default function PrivateRoute({ component: Component, ...rest }) {
  // isAuthenticated = 인증 정보
  const isAuthenticated = useRecoilValue(LoginState);

  return (
    <Route
      {...rest}
      render={({ props }) =>
        // 인증된 사용자면 App의 PrivateRoute 태그에 걸린 component={} 값을 렌더링
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          // 인증되지 않은 사용자면 로그인 화면으로 리다이렉트
          <Redirect
            to={{
              pathname: "/login",
            }}
          />
        )
      }></Route>
  );
}
