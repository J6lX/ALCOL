import { atom } from "recoil";

export const userCode = atom({
  key: "userCode",
  default: "",
});

export const isEntrance = atom({
  key: "isEntrance",
  default: "-1",
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

//---------배틀 소켓 연결 메세지 보냈는지
export const sendConnect = atom({
  key: "sendConnect",
  default: "-1",
});

//---------문제 얻는 메세지 보냈는지
export const sendGetProblem = atom({
  key: "sendGetProblem",
  default: "-1",
});

//---------배틀 시작 메세지 보냈는지
export const sendBattleStart = atom({
  key: "sendBattleStart",
  default: "-1",
});

export const isSubmitSpin = atom({
  key: "isSubmitSpin",
  default: false,
});

//---------배틀 문제 정보
export const battleProblemInfo = atom({
  key: "battleProblemInfo",
  default: {
    problem_no: 1002,
    problem_category: ["수학", "브루트포스 알고리즘"],
    problem_title: "이상한 술집",
    problem_tier: "gold",
    problem_content:
      "프로그래밍 대회 전날, 은상과 친구들은 이상한 술집에 모였다. 이 술집에서 막걸리를 시키면 주전자의 용량은 똑같았으나 안에 들어 있는 막걸리 용량은 랜덤이다. 즉 한 번 주문에 막걸리 용량이 802ml 이기도 1002ml가 나오기도 한다. 은상은 막걸리 N 주전자를 주문하고, 자신을 포함한 친구들 K명에게 막걸리를 똑같은 양으로 나눠주려고 한다. 그런데 은상과 친구들은 다른 주전자의 막걸리가 섞이는 것이 싫어서, 분배 후 주전자에 막걸리가 조금 남아 있다면 그냥 막걸리를 버리기로 한다. (즉, 한 번 주문한 막걸리에 남은 것을 모아서 친구들에게 다시 주는 경우는 없다. 예를 들어 5명이 3 주전자를 주문하여 1002, 802, 705 ml의 막걸리가 각 주전자에 담겨져 나왔고, 이것을 401ml로 동등하게 나눴을 경우 각각 주전자에서 200ml, 0m, 304ml 만큼은 버린다.) 이럴 때 K명에게 최대한의 많은 양의 막걸리를 분배할 수 있는 용량 ml는 무엇인지 출력해주세요.",
    problem_inputcontent:
      "첫째 줄에는 은상이가 주문한 막걸리 주전자의 개수 N, 그리고 은상이를 포함한 친구들의 수 K가 주어진다. 둘째 줄부터 N개의 줄에 차례로 주전자의 용량이 주어진다. N은 10000이하의 정수이고, K는 1,000,000이하의 정수이다. 막걸리의 용량은 2의 23 빼기 1 보다 작거나 같은 자연수 또는 0이다. 단, 항상 N ≤ K 이다. 즉, 주전자의 개수가 사람 수보다 많을 수는 없다.",
    problem_outputcontent: "첫째 줄에 K명에게 나눠줄 수 있는 최대의 막걸리 용량 ml 를 출력한다.",
  },
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
      nick: "except"
    },
  ],
});

//---------매칭 결과) 플레이어 정보
export const matchingPlayerInfo = atom({
  key: "matchingPlayerInfo",
  default: {
    userId: "",
    otherId: "",
    hostCheck: "",
  },
});
