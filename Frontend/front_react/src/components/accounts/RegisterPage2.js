import React, { useState, useRef } from "react";
import { Button, Form, Input, Avatar, Col, Row } from "antd";
import axios from "axios";
import "./RegisterPage.css";

function TextTitle({ text }) {
  return <h1 style={{ color: "white", textAlign: "center", marginBottom: 20 }}>{text}</h1>;
}

function TextInfo({ text }) {
  return <h4 style={{ color: "white" }}>{text}</h4>;
}

function FormRegister({ type, name, text_incorrect, text_empty, setter }) {
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

function ProfileImage() {
  const [profileImage, setProfileImage] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  );
  const fileInput = useRef(null);
  const onChange = (e) => {
    if (e.target.files[0]) {
      //사진을 선택했을때
      setProfileImage(e.target.files[0]);
    } else {
      //취소했을때
      setProfileImage(
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
      );
      return;
    }
    //화면에 프로필 사진 표시
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setProfileImage(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div>
      <Avatar
        src={profileImage}
        style={{ margin: "auto" }}
        size={130}
        onClick={() => {
          fileInput.current.click();
        }}
      />
      <input
        type="file"
        style={{ display: "none" }}
        accept="image/jpg, image/png, image/jpeg"
        name="profile_img"
        onChange={onChange}
        ref={fileInput}
      />
    </div>
  );
}

function BtnRegister() {
  return (
    <Form.Item className="button_center">
      <Button type="primary" htmlType="submit" className="button_register">
        회원가입
      </Button>
    </Form.Item>
  );
}

function App() {
  const [values, setValues] = useState({
    email: "",
    password: "",
    nickname: "",
  });
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.values,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(JSON.stringify(values, null, 3));
  };
  return (
    <div className="contents_background">
      <div className="contents_gradient">
        <div className="contents_box">
          <TextTitle text="SIGN UP" />
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col span={14} push={10}>
                <TextInfo text="사용자의 정보를 작성하세요" />
                <FormRegister
                  type="email"
                  name="Email"
                  setter={values.email}
                  onChange={handleChange}
                  text_incorrect="올바른 이메일 양식을 사용해주세요"
                  text_empty="이메일을 작성해주세요!"
                />
                <FormRegister
                  type="password"
                  name="Password"
                  setter={values.password}
                  onChange={handleChange}
                  text_incorrect="비밀번호를 작성해주세요!"
                  text_empty="비밀번호를 작성해주세요!"
                />
              </Col>
              <Col span={10} pull={14}>
                <ProfileImage />
              </Col>
            </Row>
            <TextInfo text="게임에서 사용할 닉네임을 작성하세요" />
            <FormRegister
              type="nickname"
              name="Nickname"
              setter={values.nickname}
              onChange={handleChange}
              text_incorrect="게임에서 사용할 닉네임을 지정해 주세요"
              text_empty="게임에서 사용할 닉네임을 지정해 주세요"
            />
            <BtnRegister />
          </Form>
        </div>
      </div>
    </div>
  );
}

export default App;
