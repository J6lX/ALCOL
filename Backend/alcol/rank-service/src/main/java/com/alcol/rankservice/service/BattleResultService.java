package com.alcol.rankservice.service;

import com.alcol.rankservice.dto.BattleDto;
import com.alcol.rankservice.entity.Rank;
import com.alcol.rankservice.entity.WinLose;

public interface BattleResultService
{
    public String recordCnt(WinLose winLose);
//    public BattleDto.Response recordCnt(WinLose winLose);
    public String recordRank(String mode, int mmr, String userId);
}
