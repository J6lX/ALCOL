import React from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import "./LoginPage.css";

function LoginPage() {
  // Login을 제출하면 실행되는 함수
  // 성공 시 localstorage에 토큰 발급
  // 아니면 에러 알림, 로그인 입력창 지워주기
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  return (
    <div className="fullmiddle">
      <div className="bgimage">
        <span className="overlay">
          <div className="gradientsquare">
            <div className="loginbackground">
              <h1 className="whiteletter">로그인</h1>
              <Form
                name="normal_login"
                className="login-form; middle"
                initialValues={{ remember: true }}
                onFinish={onFinish}>
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: "이메일을 입력해주세요." }]}
                  className="inputwidth">
                  <Input
                    size="large"
                    prefix={
                      <MailOutlined
                        className="site-form-item-icon"
                        style={{ marginRight: "10px" }}
                      />
                    }
                    placeholder="이메일"
                    type="email"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: "비밀번호를 입력해주세요." }]}
                  className="inputwidth">
                  <Input
                    size="large"
                    prefix={
                      <LockOutlined
                        className="site-form-item-icon"
                        style={{ marginRight: "10px" }}
                      />
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
                  <a style={{ color: "lightgray" }} href="/">
                    회원가입
                  </a>
                </Form.Item>
              </Form>
            </div>
          </div>
        </span>
      </div>
    </div>
  );
}

export default LoginPage;
