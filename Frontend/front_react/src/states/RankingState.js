import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

// recoil-persist = 페이지가 변경되어도 상태관리를 유지하기 위함
const { persistAtom } = recoilPersist();

// 랭커 데이터 저장
export const RankerListState = atom({
  key: "RankerList",
  default: [],
});

// 검색 결과 저장
export const SearchResultState = atom({
  key: "SearchResult",
  default: [],
});

// 현재 접속 사용자 저장
export const CurrentUserState = atom({
  key: "CurrentUser",
  default: null,
  effects_UNSTABLE: [persistAtom],
});
