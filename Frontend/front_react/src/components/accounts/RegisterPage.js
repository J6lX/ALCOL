import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Form, Input, Avatar, Col, Row, Modal } from "antd";
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
      <small
        className="NanumSquare"
        style={{ position: "absolute", color: "black", top: "50px", left: "14%", zIndex: "10" }}
        onClick={() => {
          fileInput.current.click();
        }}>
        프로필 사진 등록!
      </small>
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
  const [img, setImage] = useState(null);
  const onFinish = (values) => {
    const formData = new FormData();
    formData.append("file", img);
    const userData = JSON.stringify({
      email: values.email,
      pwd: values.pwd,
      nickname: values.nickname,
    });
    formData.append("signUpDto", new Blob([userData], { type: "application/json" }));
    axios
      .post("http://i8b303.p.ssafy.io:8000/user-service/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(function (response) {
        hanleResigerWarning();
        console.log("회원 가입 성공 1 :" + response);
        if (response.data.custom_code === "000") {
          console.log("회원 가입 성공 2 :" + response);
          // alert("회원가입 성공");
          setResult(response.data.description);
        }
      })
      .catch((error) => {
        hanleResigerWarning();
        console.log("회원 가입 실패 1 :" + error);
        if (error.response.data.custom_code === "003") {
          setResult(error.response.data.description);
          // alert("이메일 중복");
        } else if (error.response.data.custom_code === "004") {
          // alert("닉네임 중복");
          setResult(error.response.data.description);
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
    if (result === "회원가입에 성공하였습니다.") {
      history.push("/");
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    console.log(result);
  }, [result]);

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
                      message: "이메일 양식이 올바르지 않습니다!",
                    },
                    {
                      required: true,
                      message: "이메일을 작성해주세요!",
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
                      message: "비밀번호를 입력해주세요!",
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
                  message: "닉네임을 입력해주세요!",
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
    </div>
  );
}

export default App;
