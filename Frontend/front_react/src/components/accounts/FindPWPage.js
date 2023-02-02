import React from "react";
import "./FindPWPage.css";
import { Button, Form, Input, Col, Row } from "antd";

function TextTitle({ text }) {
  return <h1 style={{ color: "white", textAlign: "center", marginBottom: 20 }}>{text}</h1>;
}

function TextInfo({ text }) {
  return <h4 style={{ color: "white" }}>{text}</h4>;
}

function FormRegister({ type, name, text_incorrect, text_empty }) {
  return (
    <Form.Item
      name={type}
      rules={[
        {
          type: { type },
          message: { text_incorrect },
        },
        {
          required: true,
          message: { text_empty },
        },
      ]}>
      <div className="form_input">
        <div style={{ color: "white", fontSize: "10px", marginLeft: "10px" }}> {name}</div>
        <Input className="form_register" style={{ color: "white" }} bordered={false} />
      </div>
    </Form.Item>
  );
}

function BtnRegister() {
  return (
    <Form.Item className="button_center">
      <Button type="primary" htmlType="submit" className="button_register">
        수정
      </Button>
    </Form.Item>
  );
}

const FindPWPage = () => {
  return (
    <div className="contents_background">
      <div className="contents_gradient">
        <div className="contents_box">
          <TextTitle text="회원 정보" />
          <Form>
            <Row>
              <Col>
                <TextInfo text="사용자의 정보를 작성하세요" />
                <FormRegister
                  type="email"
                  name="Email"
                  text_incorrect="올바른 이메일 양식을 사용해주세요"
                  text_empty="이메일을 작성해주세요!"
                />
                <FormRegister
                  type="password"
                  name="Password"
                  text_incorrect="비밀번호를 작성해주세요!"
                  text_empty="비밀번호를 작성해주세요!"
                />
              </Col>
            </Row>
            <TextInfo text="게임에서 사용할 닉네임을 작성하세요" />
            <FormRegister
              type="nickname"
              name="Nickname"
              text_incorrect="게임에서 사용할 닉네임을 지정해 주세요"
              text_empty="게임에서 사용할 닉네임을 지정해 주세요"
            />
            <BtnRegister />
          </Form>
        </div>
      </div>
    </div>
  );
};

export default FindPWPage;
