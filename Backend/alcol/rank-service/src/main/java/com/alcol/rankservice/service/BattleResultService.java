package com.alcol.rankservice.service;

import com.alcol.rankservice.entity.WinLose;

public interface BattleResultService
{
    public String recordCnt(WinLose winLose);
    public String recordRank(String mode, int mmr, String userId);
}
