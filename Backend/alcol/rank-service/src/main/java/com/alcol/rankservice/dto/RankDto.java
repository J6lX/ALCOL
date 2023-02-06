package com.alcol.rankservice.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class RankDto
{
        private String nickname;
        private String profile_pic;
        private int level;
        private String tier;
        private int mmr;
        private int winCnt;
        private int loseCnt;
        private long winningRate;

        @Getter
        static public class UserData {
                private String nickname;
                private String stored_file_name;
                private int level;
                private String speed_tier;
                private String optimization_tier;
        }
}
