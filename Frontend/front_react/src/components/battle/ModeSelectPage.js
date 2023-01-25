import React from "react";
import { Col, Row } from "antd";
import "./ModeSelectPage.css";

function UserInfo() {
    return (
        <Row justify="end" className="battle_user_info_row">
            <Col span={1} className="battle_user_info_contents">
                멋진 티어
            </Col>
            <Col span={1} className="battle_user_info_contents">
                멋진 티어
            </Col>
            <Col span={3} className="battle_user_info_contents">
                멋진 닉네임
            </Col>
        </Row>
    );
}

function SelectMode() {
    return (
        <div className="battle_mode_box">
            <h1 style={{ color: "white" }}>모드를 선택하세요</h1>
            <div>
                <div className="img_speedMode"></div>
                <div className="text_Mode">스피드</div>
                <div>
                    <p>최대한 빠르게 정답을 맞추세요!</p>
                </div>
                <div>체크 아이콘</div>
            </div>
        </div>
    );
}

function App() {
    return (
        <div>
            <UserInfo />
            <SelectMode />
        </div>
    );
}

export default App;
