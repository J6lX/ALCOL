import { recoilPersist } from "recoil-persist";
import { atom } from "recoil";

// 페이지가 전환되어도 랭커 정보를 유지
const { persistAtom } = recoilPersist();

// 랭커 정보 저장
export const RankerData = atom({
  key: "RankerData",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
