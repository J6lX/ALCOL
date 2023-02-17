import React, { useEffect } from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import { useHistory } from "react-router-dom";
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

// 사진이 없는 경우 기본 사진을 반환하는 용도
function isNew(picture) {
  // 기존 사진이 있는 경우
  if (picture) {
    return picture;
  }
  // 기존 사진이 없는 경우
  else {
    return `https://kimjusung-bucket.s3.ap-northeast-2.amazonaws.com/loofy.png`;
  }
}

// 페이지 렌더링 함수
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
          // alert(response.data.description);
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
              hanleResigerWarning();
              // 사용자 기본 정보를 recoil(userInfo)에 저장
              const receivedUserData = {
                nickname: response.data.nickname,
                // 저장된 이미지가 없으면(신규 회원인 경우 등) 기본 이미지로 대체
                profileImg: isNew(response.data.stored_file_name),
                level: response.data.level,
                // 매칭 시 mmr이 없는 문제가 생기면 별도로 설정해줘야 함
                speedTier: response.data.speed_tier,
                efficiencyTier: response.data.optimization_tier,
              };
              setUserInfo(receivedUserData);
              setResult("로그인 성공!");
            });
        }
      })
      //로그인 실패 시
      .catch((error) => {
        hanleResigerWarning();
        console.log("로그인 실패1 : " + error);
        if (error.response.data.custom_code === "006") {
          setResult(error.response.data.description);
          // 로그인 실패 시 표시하는 내용
          // alert(error.response.data.description);
        }
      });
  };
  const history = useHistory();
  const hanleResigerWarning = () => {
    showModal();
  };
  //Modal 선택 관련
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [result, setResult] = React.useState();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    if (result === "로그인 성공!") {
      history.push("/");
    }
    setIsModalOpen(false);
  };
  useEffect(() => {
    console.log(result);
  }, [result]);

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
            <h1 className="whiteletter" style={{ paddingTop: "3vw", fontFamily: "NanumSquareNeo" }}>
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
              <a
                className="login-form-forgot"
                style={{ color: "lightgray", fontFamily: "NanumSquareNeo" }}
                href="/">
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
                  style={{ height: "40px", margin: "5px", fontFamily: "NanumSquareNeo" }}>
                  <b>로그인</b>
                </Button>
              </Form.Item>
              <Form.Item>
                <a style={{ color: "lightgray", fontFamily: "NanumSquareNeo" }} href="/register">
                  회원가입
                </a>
              </Form.Item>
            </Form>
            <Modal
              title="😮"
              open={isModalOpen}
              closable={false}
              width={300}
              centered
              footer={null}
              style={{ textAlign: "center" }}>
              <p style={{ textAlign: "center" }}>{result}</p>
              <div style={{ marginTop: "10px" }}>
                <Button style={{ background: "#FEF662" }} onClick={handleOk}>
                  확인
                </Button>
              </div>
            </Modal>
          </div>
        </div>
      </span>
    </div>
  );
}

export default LoginPage;
