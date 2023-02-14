package com.alcol.rankservice.dto;

import lombok.*;

public class RankDto
{
        @Getter
        @Builder
        @NoArgsConstructor(access = AccessLevel.PROTECTED)
        @AllArgsConstructor
        static public class Ranking {
                private long grade;
                private String nickname;
                private String profile_pic;
                private int level;
                private String tier;
                private int mmr;
                private WinLoseCount record;

        }

        @Getter
        @Builder
        @AllArgsConstructor
        @NoArgsConstructor(access = AccessLevel.PROTECTED)
        static public class UserData
        {
                private String nickname;
                private int level;
                private String speed_tier;
                private String optimization_tier;
                private String stored_file_name;
        }

        @Getter
        @Builder
        @AllArgsConstructor
        @NoArgsConstructor(access = AccessLevel.PROTECTED)
        static public class WinLoseCount
        {
                private long win;
                private long lose;
                private long winningRate;
        }
        @Getter
        @Builder
        @AllArgsConstructor
        @NoArgsConstructor(access = AccessLevel.PROTECTED)
        static public class RankingAndMMR
        {
                private long grade;
                private int MMR;
        }

        @Getter
        @Builder
        @AllArgsConstructor
        @NoArgsConstructor(access = AccessLevel.PROTECTED)
        static public class Top3Ranking
        {
                private int grade;
                private String nickname;
                private String storedFileName;
        }

        @Getter
        @Builder
        @AllArgsConstructor
        public static class ResponseDto<T>
        {
                private final boolean success;
                private final T bodyData;
                private final String customCode;
                private final String description;
        }

}
