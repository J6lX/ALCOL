package com.alcol.rankservice.dto;

import lombok.Getter;

@Getter
public class RedisOffDto
{
    private String userId;
    private int speed_win;
    private int speed_lose;
    private int speed_mmr;
    private int optimizatoin_win;
    private int optimization_lose;
    private int optimization_mmr;

}
