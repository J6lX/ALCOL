import React, { useState, useRef } from "react";
import { Button, Form, Input, Avatar, Col, Row } from "antd";
import axios from "axios";
import "./RegisterPage.css";

function TextTitle({ text }) {
  return (
    <h1
      style={{
        color: "white",
        textAlign: "center",
        fontFamily: "NanumSquareNeo",
        marginBottom: 20,
      }}>
      {text}
    </h1>
  );
}

function TextInfo({ text }) {
  return <h4 style={{ color: "white", fontFamily: "NanumSquareNeo" }}>{text}</h4>;
}

function ProfileImage({ setImage }) {
  const [profileImage, setProfileImage] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  );
  const fileInput = useRef(null);
  const onChange = (e) => {
    if (e.target.files[0]) {
      //사진을 선택했을때
      setProfileImage(e.target.files[0]);
      setImage(e.target.files[0]);
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

function App() {
  // const [userInfo, setValues] = useState({
  //   email: "",
  //   pwd: "",
  //   nickname: "",
  // });
  const [img, setImage] = useState(null);
  const onFinish = (values) => {
    //-----이미지 처리-----
    console.log("받은 이미지:", img);
    //formData를 만들어 img라는 이름의 객체로 현재 img 상태를 서버로 요청 보냅니다.
    const formData = new FormData();
    formData.append("file", img);
    console.log("보낼 이미지:", formData);
    //-----이미지 처리 끝-----
    // setValues({ ...values });
    // console.log("입력한 회원 정보 : ", values.email, values.pwd, values.nickname);
    const userData = JSON.stringify({
      email: values.email,
      pwd: values.pwd,
      nickname: values.nickname,
    });
    formData.append("signUpDto", new Blob([userData], { type: "application/json" }));
    axios
      .post("http://localhost:8000/user-service/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(function (response) {
        if (response.data.customCode === "000") {
          alert("회원가입 성공");
        }
      })
      .catch((error) => {
        if (error.response.data.customCode === "001") {
          alert("이메일 중복");
        } else if (error.response.data.customCode === "002") {
          alert("닉네임 중복");
        }
      });
  };
  return (
    <div className="contents_background">
      <div className="contents_gradient">
        <div className="contents_box">
          <TextTitle text="SIGN UP" />
          <Form onFinish={onFinish} name="register">
            <Row>
              <Col span={14} push={10}>
                <TextInfo text="사용자의 정보를 작성하세요" />
                <Form.Item
                  name="email"
                  rules={[
                    {
                      type: "email",
                      message: "The input is not valid E-mail!",
                    },
                    {
                      required: true,
                      message: "Please input your E-mail!",
                    },
                  ]}>
                  <div className="form_input">
                    <div style={{ color: "white", fontSize: "10px", marginLeft: "10px" }}>
                      email
                    </div>
                    <Input className="form_register" style={{ color: "white" }} bordered={false} />
                  </div>
                </Form.Item>
                <Form.Item
                  name="pwd"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                  hasFeedback>
                  <div className="form_input">
                    <div style={{ color: "white", fontSize: "10px", marginLeft: "10px" }}>
                      password
                    </div>
                    <Input.Password
                      className="form_register"
                      style={{ color: "white" }}
                      bordered={false}
                    />
                  </div>
                </Form.Item>
              </Col>
              <Col span={10} pull={14}>
                <ProfileImage setImage={setImage} />
              </Col>
            </Row>
            <TextInfo text="게임에서 사용할 닉네임을 작성하세요" />
            <Form.Item
              name="nickname"
              rules={[
                {
                  required: true,
                  message: "Please input your nickName!",
                },
              ]}>
              <div className="form_input">
                <div style={{ color: "white", fontSize: "10px", marginLeft: "10px" }}>nickname</div>
                <Input className="form_register" style={{ color: "white" }} bordered={false} />
              </div>
            </Form.Item>
            {/* <BtnRegister /> */}
            <Form.Item className="button_center">
              <Button htmlType="submit" className="button_register">
                회원가입
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default App;
