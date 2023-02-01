package com.alcol.rankservice.entity;

import com.alcol.rankservice.dto.RecordDto;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Builder
@AllArgsConstructor
public class Rank
{
    public static class RankingData {
        private String nickname;
        private String profile_pic;
        private int level;
        private String tier;
        private int mmr;
        private int winningRate;
    }

    public static class ReceivedUserData{
        private String nickname;
        private String profile_pic;
        private int level;
        private String tier;
    }

}
