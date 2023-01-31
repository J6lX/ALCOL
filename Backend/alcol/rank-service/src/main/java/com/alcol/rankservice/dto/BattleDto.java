package com.alcol.rankservice.dto;

import lombok.*;

import javax.validation.constraints.NotBlank;

@AllArgsConstructor
public class BattleDto {

    @RequiredArgsConstructor
    public static class Request
    {
        private String user_id_1; // 유저 식별 아이디1
        private String user_id_2; // 유저 식별 아이디2
        private String battle_mode; // 배틀모드
        private int problem_number; // 문제 번호
        private int mmr_1; // 유저1의 MMR
        private int mmr_2; // 유저2의 MMR
        private int win_1; // 유저1의 승리 여부(1:승리, 0:패배)
    }

    @Builder
    public static class Response
    {
        private String returnMsg;
        private int returnCode;
    }
}
