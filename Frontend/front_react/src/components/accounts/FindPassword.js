import React, { useState } from "react";
import { Button, Form, Input, Modal } from "antd";
// import axios from "axios";
import "./FindPassword.css";

function App() {
  const onFinish = (values) => {
    showModal();
  };

  function TextInfo({ text }) {
    return (
      <h4
        style={{
          color: "white",
          fontFamily: "NanumSquareNeo",
          marginBottom: "10px",
          textAlign: "center",
        }}>
        {text}
      </h4>
    );
  }

  //Modal 선택 관련
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="findPass_background">
      <div className="findPass_gradient">
        <div className="findPass_box">
          <TextInfo text="작성한 이메일로 요청을 보냅니다" />
          <Form onFinish={onFinish} name="register">
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  message: "이메일 양식이 올바르지 않습니다!",
                },
                {
                  required: true,
                  message: "이메일을 작성해주세요!",
                },
              ]}>
              <div className="form_input">
                <div style={{ color: "white", fontSize: "10px", marginLeft: "10px" }}>email</div>
                <Input className="form_register" style={{ color: "white" }} bordered={false} />
              </div>
            </Form.Item>
            <Form.Item className="button_center">
              <Button htmlType="submit" className="button_register">
                비밀번호 찾기
              </Button>
            </Form.Item>
          </Form>
          <Modal
            title="😊"
            open={isModalOpen}
            closable={true}
            width={500}
            centered
            footer={null}
            style={{ textAlign: "center" }}>
            <p style={{ textAlign: "center" }}>
              비밀번호를 초기화 하는 방법을 이메일 주소로 전송했습니다.
            </p>
            <p style={{ textAlign: "center" }}>
              가입한 적이 없는 이메일 주소나 올바르지 않은 이메일 주소를
            </p>
            <p style={{ textAlign: "center" }}> 입력하신 경우에는 메일을 받을 수 없습니다.</p>
            <div style={{ marginTop: "10px" }}>
              <Button style={{ background: "#FEF662" }} onClick={handleOk}>
                확인
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default App;
