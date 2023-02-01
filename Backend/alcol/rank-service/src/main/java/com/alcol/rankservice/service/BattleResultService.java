package com.alcol.rankservice.service;

import com.alcol.rankservice.dto.BattleDto;
import com.alcol.rankservice.entity.Rank;
import com.alcol.rankservice.entity.WinLose;

public interface BattleResultService
{
    public BattleDto.Response recordResult(WinLose winLose);
    public String recordRank(Rank.ReceivedUserData user, String mode, int mmr);
}
