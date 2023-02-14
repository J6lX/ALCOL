package com.alcol.rankservice.dto;

import lombok.*;

@AllArgsConstructor
public class BattleDto {

    @Getter
    public static class Request
    {
        private String user_id_1; // 유저 식별 아이디1
        private String user_id_2; // 유저 식별 아이디2
        private String battle_mode; // 배틀모드
        private String mmr_1; // 유저1의 MMR
        private String mmr_2; // 유저2의 MMR
        private String winner; // 승리자
    }

    @Builder
    public static class Response
    {
        private String returnMsg;
    }
}
