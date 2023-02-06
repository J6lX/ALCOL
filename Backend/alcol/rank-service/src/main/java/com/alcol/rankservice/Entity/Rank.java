package com.alcol.rankservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Builder
@Getter
public class Rank
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
