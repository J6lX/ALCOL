package com.alcol.rankservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class WinLoseDto
{
    private String userId;
    private String mode;
    private int winner;

}
