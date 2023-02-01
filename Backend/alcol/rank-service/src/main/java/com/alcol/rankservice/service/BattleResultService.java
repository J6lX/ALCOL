package com.alcol.rankservice.service;

import com.alcol.rankservice.dto.BattleDto;

public interface BattleResultService
{
    public String recordResult(BattleDto.Request battleResult);
}
