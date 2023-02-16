import { recoilPersist } from "recoil-persist";
import { atom } from "recoil";

// recoil-persist = 페이지가 변경되어도 상태관리를 유지하기 위함
const { persistAtom } = recoilPersist();

// 로그인 여부 저장
// LoginState에는 사용자 ID(닉네임 X)를 저장
export const LoginState = atom({
  key: "LoginState",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

// 액세스 토큰 정보 저장
export const AccessTokenInfo = atom({
  key: "AccessToken",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

// 리프레시 토큰 정보 저장
export const RefreshTokenInfo = atom({
  key: "RefreshToken",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

// 유저 정보를 리스트로 저장
export const UserInfoState = atom({
  key: "UserInfoState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

// 유저 전적을 리스트로 저장
export const userBattleRec = atom({
  key: "UserBattleRec",
  default: [],
});

// 닉네임만 저장
export const CurrentNickname = atom({
  key: "userNickname",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

// mmr만 저장
export const MMRState = atom({
  key: "MMRState",
  default: "",
});

// 다른 유저 정보를 저장(프로필 조회용)
export const OtherUserInfoState = atom({
  key: "OtherUserInfoState",
  default: [],
});
