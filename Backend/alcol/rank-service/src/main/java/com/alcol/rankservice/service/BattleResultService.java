package com.alcol.rankservice.service;

import com.alcol.rankservice.dto.WinLoseDto;

public interface BattleResultService
{
    public String recordCnt(WinLoseDto winLose);
    public String recordRank(String mode, int mmr, String userId);
    public String recordUserData(String userId);
}
