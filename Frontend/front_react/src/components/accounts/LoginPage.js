import React from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import loginBg from "../../assets/loginbg.jpg";
import "./LoginPage.css";
import axios from "axios";

function LoginPage() {
  // Login을 제출하면 실행되는 함수
  // 성공 시 localstorage에 토큰 발급
  // 아니면 에러 알림, 로그인 입력창 지워주기

  // 기존 코드
  // const onFinish = (values) => {
  //   console.log("Received values of form: ", values);
  // };

  // 로그인 요청 전송
  const onFinish = (values) => {
    //-----이미지 처리-----
    //formData를 만들어 img라는 이름의 객체로 현재 img 상태를 서버로 요청 보냅니다.
    // const formData = new FormData();
    // formData.append("file");
    // console.log("전송하는 정보:", formData);
    //-----이미지 처리 끝-----
    // setValues({ ...values });
    // console.log("입력한 회원 정보 : ", values.email, values.pwd, values.nickname);

    // 백엔드에 보낼 데이터 구성
    const userData = JSON.stringify({
      email: values.email,
      pwd: values.pwd,
    });
    // formData.append("signUpDto", new Blob([userData], { type: "application/json" }));
    console.log(userData);

    // axios 통신 진행
    axios
      .post("http://i8b303.p.ssafy.io:8000/user-service/login", userData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      // 로그인 성공 시(커스텀 코드 006)
      .then(function (response) {
        if (response.data.customCode === "006") {
          //access-token, refresh-token, userId 저장
          const accessToken = response.headers.accessToken;
          const refreshToken = response.headers.refreshToken;
          const userId = response.data.bodyData.userId;
        }
      })

      //로그인 실패 시
      .catch((error) => {
        if (error.response.data.customCode === "001") {
          alert("이메일 중복");
        } else if (error.response.data.customCode === "002") {
          alert("닉네임 중복");
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
