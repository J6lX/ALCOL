import { recoilPersist } from "recoil-persist";
import { atom } from "recoil";

// recoil-persist = 페이지가 변경되어도 상태관리를 유지하기 위함
const { persistAtom } = recoilPersist();

// 로그인 여부 저장
export const LoginState = atom({
  key: "LoginState",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

// 액세스 토큰 정보 저장
export const AccessTokenInfo = atom({
  key: "AccessToken",
  default: [],
});

// 리프레시 토큰 정보 저장
export const RefreshTokenInfo = atom({
  key: "RefreshToken",
  default: [],
});
