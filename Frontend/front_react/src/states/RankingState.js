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

// 현재 접속한 사용자 랭킹 정보 저장
export const CurrentUserRankingState = atom({
  key: "CurrentUserRankingState",
  default: null,
});

// 지난 시즌 시즌 정보 저장
export const LastSeasonState = atom({
  key: "LastSeasonState",
  default: [],
});

// 백업용 전적 저장
export const BackupBattleRec = atom({
  key: "BackupBattleRec",
  default: [],
});

// 백업용 시즌 기록 저장
export const BackupLastSeasonState = atom({
  key: "BackupLastSeasonState",
  default: [],
});
