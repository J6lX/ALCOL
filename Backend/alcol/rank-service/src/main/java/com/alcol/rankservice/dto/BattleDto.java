package com.alcol.rankservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

public class BattleDto {

    @AllArgsConstructor
    public static class Info
    {
        private String profile_pic;
        private String nickname;
        private int level;
        private String tier;
        private int MMR;
        private RecordDto record;
    }

    @Builder
    public static class Request
    {
        @NotBlank
        private String user_id_1; // 유저 식별 아이디1
        @NotBlank
        private String user_id_2; // 유저 식별 아이디2
        @NotBlank
        private String battle_mode; // 배틀모드
        @NotBlank
        private int problem_number; // 문제 번호
        @NotBlank
        private int mmr_1; // 유저1의 MMR
        @NotBlank
        private int mmr_2; // 유저2의 MMR
        @NotBlank
        private int win_1; // 유저1의 승리 여부(1:승리, 0:패배)
    }

    @Builder
    public static class Response
    {
        private String returnMsg;
        private int returnCode;
    }
}
