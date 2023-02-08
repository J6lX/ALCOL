package com.alcol.logservice.dto;

import lombok.*;

import java.time.LocalDateTime;

public class LogDto
{
    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserPlayDto
    {
        private int exp;
        private int speedMmr;
        private int optimizationMmr;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserBattleLogDto
    {
        private int battleResult;
        private String battleMode;
        private String otherUserId;
        private String otherUserNickname;
        private Long probNo;
        private String probName;
        private String probTier;
        private LocalDateTime endTime;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProbDetailDto
    {
        private Long probNo;
        private String probName;
        private String probTier;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserResultAndMmrDto
    {
        private String userId;
        private int speedMmr;
        private int speedWin;
        private int speedLose;
        private int optimizationMmr;
        private int optimizationWin;
        private int optimizationLose;
    }
}
