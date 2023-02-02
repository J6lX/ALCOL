package com.alcol.rankservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
public class Rank
{
    @Builder
    @Getter
    public static class RankingData
    {
        private String nickname;
        private String profile_pic;
        private int level;
        private String tier;
        private int mmr;
        private int winCnt;
        private int loseCnt;
        private long winningRate;
    }

    @Getter
    public static class ReceivedUserData
    {
        private String nickname;
        private String profile_pic;
        private int level;
        private String tier;
    }

}
