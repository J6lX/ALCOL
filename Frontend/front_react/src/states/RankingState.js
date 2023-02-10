import { atom } from "recoil";

// 랭커 데이터 저장
export const RankerListState = atom({
  key: "RankerList",
  default: [],
});
