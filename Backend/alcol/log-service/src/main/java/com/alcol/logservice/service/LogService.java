package com.alcol.logservice.service;

import com.alcol.logservice.dto.LogDto;

import java.net.URISyntaxException;
import java.util.List;

public interface LogService
{
    LogDto.UserPlayDto getLevelAndTier(String userId) throws URISyntaxException;

    List<LogDto.UserBattleLogDto> getBattleLog(String userId);
}
