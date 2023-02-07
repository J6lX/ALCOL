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
        private int problem_number; // 문제 번호
        private int mmr_1; // 유저1의 MMR
        private int mmr_2; // 유저2의 MMR
        private int exp_1; // 유저1의 경험치
        private int exp_2; // 유저2의 경험치
        private int win_1; // 유저1의 승리 여부(1:승리, 0:패배)
        private int win_2;
    }

    @Builder
    public static class Response
    {
        private String returnMsg;
    }
}
