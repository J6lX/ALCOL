package com.alcol.rankservice.entity;

import lombok.Builder;
import lombok.Getter;

import javax.persistence.Entity;
import javax.persistence.Id;

@Getter
@Builder
public class WinLoseCnt
{
    private String userId;
    private String mode;
    private int winLose;

}
