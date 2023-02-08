import { atom } from "recoil";

export const userCode = atom({
  key: "userCode",
  default: "",
});

//---------모드선택
export const selectedMode = atom({
  key: "selectedMode",
  default: "-1",
});

//---------언어선택
export const selectedLanguage = atom({
  key: "selectedLanguage",
  default: "-1",
});

//---------배틀 결과) 유저 정보
export const resultListPlayerInfo = atom({
  key: "resultListPlayerInfo",
  default: {
    player1_info: "player1",
    player1_tier: "gold",
    player1_level: "15",
    player2_info: "player2",
    player2_tier: "gold",
    player2_level: "20",
  },
});

//---------배틀 결과) 게임 정보
export const resultListModeInfo = atom({
  key: "resultListModeInfo",
  default: {
    problem_difficulty: "gold",
    used_language: "java",
    avg_try: "10",
    spend_time: "10:38",
  },
});

//---------배틀 결과) 게임 결과 정보
export const resultListResultInfo = atom({
  key: "resultListResultInfo",
  default: [
    {
      player_info: "player1",
      result: "오답",
      code_length: "3000",
      memory: "300",
      time: "00:30",
    },
    {
      player_info: "player2",
      result: "오답",
      code_length: "3000",
      memory: "300",
      time: "00:30",
    },
    {
      player_info: "player2",
      result: "오답",
      code_length: "3000",
      memory: "300",
      time: "00:30",
    },
    {
      player_info: "player1",
      result: "정답",
      code_length: "3000",
      memory: "300",
      time: "00:30",
    },
  ],
});

//---------매칭 결과) 플레이어 정보
export const matchingPlayerInfo = atom({
  key: "matchingPlayerInfo",
  default: {
    userId: "",
    otherId: "",
  },
});
