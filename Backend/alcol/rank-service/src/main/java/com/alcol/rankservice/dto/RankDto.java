package com.alcol.rankservice.dto;

import lombok.*;

public class RankDto
{
        @Getter
        @Builder
        @NoArgsConstructor(access = AccessLevel.PROTECTED)
        @AllArgsConstructor
        static public class Ranking {
                private String nickname;
                private String profile_pic;
                private int level;
                private String tier;
                private int mmr;
                private WinLoseCount record;
                private long grade;
        }

        @Getter
        @Builder
        @AllArgsConstructor
        @NoArgsConstructor(access = AccessLevel.PROTECTED)
        static public class UserData {
                private String nickname;
                private String stored_file_name;
                private int level;
                private String speed_tier;
                private String optimization_tier;
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
}
