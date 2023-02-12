package com.alcol.logservice.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
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
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
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
    @AllArgsConstructor
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    public static class UserSeasonLogDto
    {
        private String battleMode;
        private String season;
        private String tier;
        private int ranking;
        private int winCnt;
        private int loseCnt;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProbDetailDto
    {
        private Long prob_no;
        private String prob_name;
        private String prob_tier;
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
