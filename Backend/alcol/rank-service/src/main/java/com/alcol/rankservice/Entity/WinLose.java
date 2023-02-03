package com.alcol.rankservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
public class WinLose
{
    private String userId;
    private String mode;
    private int winLoseResult;

}
