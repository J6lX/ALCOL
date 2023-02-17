package com.alcol.rankservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RedisOffDto
{
    private String userId;
    private int speedMmr;
    private int speedWin;
    private int speedLose;
    private int optimizationMmr;
    private int optimizationWin;
    private int optimizationLose;
}
