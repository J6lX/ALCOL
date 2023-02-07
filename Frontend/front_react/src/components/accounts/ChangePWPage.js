import React from "react";
import "./ChangePWPage.css";
import { Button, Form, Input, Col, Row } from "antd";

function TextTitle({ text }) {
  return <h1 className="NanumSquare" style={{ color: "white", textAlign: "center", marginBottom: 20, fontWeight: "bolder" }}>{text}</h1>;
}

function TextInfo({ text }) {
  return <h4 className="NanumSquare" style={{ color: "white" }}>{text}</h4>;
}

function FormFindPW({ type, name, text_incorrect, text_empty }) {
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
      <div className="form_input" style={{ textAlign: "left" }}>
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
        변경
      </Button>
    </Form.Item>
  );
}

const ChangePWPage = () => {
  return (
    <div className="contents_background">
      <div className="contents_gradient">
        <div className="contents_box">
          <TextTitle text="비밀번호 변경" />
          <Form>
            <Row>
              <Col>
                <TextInfo text="사용자의 정보를 작성하세요" />
                <br />
                <FormFindPW
                  type="password"
                  name="Password"
                  text_incorrect="새로운 비밀번호를 작성해주세요!"
                  text_empty="새로운 비밀번호를 작성해주세요!"
                />
                <FormFindPW
                  type="passwordconfirm"
                  name="Passwordconfirm"
                  text_incorrect="비밀번호를 작성해주세요!"
                  text_empty="비밀번호를 작성해주세요!"
                />
              </Col>
            </Row>
            <BtnRegister />
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ChangePWPage;
