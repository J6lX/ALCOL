// 연습 문제 저장용
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

// recoil-persist = 페이지가 변경되어도 상태관리를 유지하기 위함
const { persistAtom } = recoilPersist();

// 연습 문제 저장
export const PracticeProblemState = atom({
  key: "PracticeProblem",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
