import { React } from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import loginBg from "../../assets/loginbg.jpg";
import "./LoginPage.css";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import {
  AccessTokenInfo,
  LoginState,
  RefreshTokenInfo,
  UserInfoState,
} from "../../states/LoginState";

function LoginPage() {
  // 로그인 상태 관리(LoginState의 데이터를 변경)
  const setIsLoggedIn = useSetRecoilState(LoginState);
  const setAccessTokenData = useSetRecoilState(AccessTokenInfo); // 토큰 데이터를 변경하고, 변경이 성공적으로 적용되었는지 확인
  const setRefreshTokenData = useSetRecoilState(RefreshTokenInfo);
  const setUserInfo = useSetRecoilState(UserInfoState);

  // Login을 제출하면 실행되는 함수
  // 성공 시 localstorage에 토큰 발급
  // 아니면 에러 알림, 로그인 입력창 지워주기

  // 로그인 요청 전송
  const onFinish = (values) => {
    // 백엔드에 보낼 데이터 구성
    const userData = JSON.stringify({
      email: values.email,
      pwd: values.pwd,
    });

    // axios 통신 진행
    axios
      .post("http://i8b303.p.ssafy.io:8000/user-service/login", userData)
      // 로그인 성공 시(커스텀 코드 006)
      .then(function (response) {
        if (response.data.custom_code === "001") {
          alert(response.data.description);
          //access-token, refresh-token, userId 저장
          // 이 데이터들을 리코일에 저장하면 됨
          const accessToken = response.data.body_data.access_token;
          const refreshToken = response.data.body_data.refresh_token;
          const userId = response.data.body_data.user_id;

          // 로그인 상태를 true로 변경하고, 토큰 정보를 저장
          setIsLoggedIn(userId);
          setRefreshTokenData(refreshToken);
          setAccessTokenData(accessToken);

          // userId 정보를 바탕으로 닉네임 정보 요청
          axios
            .post(`http://i8b303.p.ssafy.io:9000/user-service/getUserInfo`, { user_id: userId })
            .then(function (response) {
              // 사용자 기본 정보를 recoil(userInfo)에 저장
              const receivedUserData = {
                nickname: response.data.nickname,
                profileImg: response.data.stored_file_name,
                level: response.data.level,
                speedTier: response.data.speed_tier,
                efficiencyTier: response.data.optimization_tier,
              };
              setUserInfo(receivedUserData);
              window.location.reload();
            });
          // 로그인에 성공하면 메인 화면으로 리다이렉트
        }
      })
      //로그인 실패 시
      .catch((error) => {
        console.log("로그인 실패1 : " + error);
        if (error.response.data.custom_code === "006") {
          console.log("로그인 실패2 : " + error);
          // 로그인 실패 시 표시하는 내용
          alert(error.response.data.description);
        }
      });
  };

  return (
    <div className="fullmiddle_login" style={{ backgroundColor: "black" }}>
      <div style={{ position: "relative", width: "100vw", height: "100ch", opacity: "0.4" }}>
        <div
          style={{
            textAlign: "center",
            position: "absolute",
            top: "0",
            right: "-200%",
            bottom: "0",
            left: "-200%",
          }}>
          <img
            src={loginBg}
            alt="loginbackgroundimg"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </div>
      </div>
      <span className="overlay">
        <div className="gradientsquare">
          <div className="loginbackground">
            <h1 className="whiteletter" style={{ paddingTop: "3vw" }}>
              로그인
            </h1>
            <Form
              name="normal_login"
              className="login-form middle"
              initialValues={{ remember: true }}
              onFinish={onFinish}>
              <Form.Item
                name="email"
                rules={[{ required: true, message: "이메일을 입력해주세요." }]}
                className="inputwidth">
                <Input
                  size="large"
                  prefix={
                    <MailOutlined className="site-form-item-icon" style={{ marginRight: "10px" }} />
                  }
                  placeholder="이메일"
                  type="email"
                />
              </Form.Item>
              <Form.Item
                name="pwd"
                rules={[{ required: true, message: "비밀번호를 입력해주세요." }]}
                className="inputwidth">
                <Input
                  size="large"
                  prefix={
                    <LockOutlined className="site-form-item-icon" style={{ marginRight: "10px" }} />
                  }
                  type="password"
                  placeholder="비밀번호"
                />
              </Form.Item>
              <a className="login-form-forgot" style={{ color: "lightgray" }} href="/">
                비밀번호를 잊으셨나요?
              </a>
              {/* <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
              </Form.Item> */}
              <br />
              <Form.Item style={{ margin: "auto" }}>
                <Button
                  htmlType="submit"
                  className="login-form-button"
                  style={{ height: "40px", margin: "5px" }}>
                  <b>로그인</b>
                </Button>
              </Form.Item>
              <Form.Item>
                <a style={{ color: "lightgray" }} href="/register">
                  회원가입
                </a>
              </Form.Item>
            </Form>
          </div>
        </div>
      </span>
    </div>
  );
}

export default LoginPage;
