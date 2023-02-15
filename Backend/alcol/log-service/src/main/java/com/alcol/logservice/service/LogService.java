package com.alcol.logservice.service;

import com.alcol.logservice.dto.LogDto;

import java.net.URISyntaxException;
import java.util.List;

public interface LogService
{
    List<LogDto.UserBattleLogDto> getBattleLog(String userId) throws URISyntaxException;

    LogDto.UserPlayDto getExpAndMmr(String userId);

    List<LogDto.UserResultAndMmrDto> getAllResultAndMmr() throws URISyntaxException;

    List<LogDto.UserSeasonLogDto> getPastSeasonLog(String user_id);

    void insertBattleLog(LogDto.BattleLogDto winnerBattleLogDto, LogDto.BattleLogDto loserBattleLogDto, List<LogDto.BattleProbSubmitLogDto> winnerSubmitLogList, List<LogDto.BattleProbSubmitLogDto> loserSubmitLogList);

    int insertExp(String userId, int addExp) throws URISyntaxException;
}
