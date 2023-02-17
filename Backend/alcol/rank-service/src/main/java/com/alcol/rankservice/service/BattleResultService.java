package com.alcol.rankservice.service;

import com.alcol.rankservice.dto.WinLoseDto;

public interface BattleResultService
{
    public boolean recordCnt(WinLoseDto winLose);
    public boolean recordRank(String mode, int mmr, String userId);
    public boolean recordUserData(String userId);
}
