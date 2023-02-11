package com.alcol.logservice.service;

import com.alcol.logservice.dto.LogDto;
import com.alcol.logservice.entity.BattleLogEntity;
import com.alcol.logservice.entity.ExpLogEntity;
import com.alcol.logservice.repository.BattleLogRepository;
import com.alcol.logservice.repository.ExpLogRepository;
import com.alcol.logservice.util.RestTemplateUtils;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.config.Configuration;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class LogServiceImpl implements LogService
{
    private final ExpLogRepository expLogRepository;
    private final BattleLogRepository battleLogRepository;
    private final RestTemplateUtils restTemplateUtils;

    public LogServiceImpl(
            ExpLogRepository expLogRepository,
            BattleLogRepository battleLogRepository,
            RestTemplateUtils restTemplateUtils
    )
    {
        this.expLogRepository = expLogRepository;
        this.battleLogRepository = battleLogRepository;
        this.restTemplateUtils = restTemplateUtils;
    }

    /**
     * @param userId
     * @return 해당 유저의 경험치, 스피드전 mmr, 효율성전 mmr 을 리턴
     */
    @Override
    public LogDto.UserPlayDto getExpAndMmr(String userId)
    {
        ExpLogEntity expLogEntity =
                expLogRepository.findTopByUserIdOrderByExpLogNoDesc(userId);

        BattleLogEntity battleLogEntityBySpeed =
                battleLogRepository.findTopByMyUserIdAndBattleModeOrderByBattleLogNoDesc(
                        userId, "speed"
                );

        BattleLogEntity battleLogEntityByOptimization =
                battleLogRepository.findTopByMyUserIdAndBattleModeOrderByBattleLogNoDesc(
                        userId, "optimization"
                );

        return LogDto.UserPlayDto.builder()
                .exp(expLogEntity == null ? 1 : expLogEntity.getCurExp())
                .speedMmr(battleLogEntityBySpeed == null ? 1000 : battleLogEntityBySpeed.getNowMmr())
                .optimizationMmr(
                        battleLogEntityByOptimization == null ? 1000 : battleLogEntityByOptimization.getNowMmr()
                )
                .build();
    }

    /**
     * @param userId
     * @return 해당 유저의 배틀 로그 리스트를 리턴
     */
    @Override
    public List<LogDto.UserBattleLogDto> getBattleLog(String userId)
            throws URISyntaxException
    {
        log.info("LogServiceImpl 의 getBattleLog 메소드 실행");

        List<BattleLogEntity> battleLogEntityList =
                battleLogRepository.findTop10ByMyUserIdOrderByBattleLogNoDesc(userId);

        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT)
                .setFieldAccessLevel(Configuration.AccessLevel.PRIVATE)
                .setFieldMatchingEnabled(true);

        List<LogDto.UserBattleLogDto> battleLogDtoList = new ArrayList<>();
        List<String> probNoList = new ArrayList<>();

        for (BattleLogEntity battleLogEntity : battleLogEntityList)
        {
            battleLogDtoList.add(modelMapper.map(battleLogEntity, LogDto.UserBattleLogDto.class));
            probNoList.add(battleLogEntity.getProbNo() + "");
        }

        // log-service -> problem-service
        // param : probNoList
        // return : prob name, prob tier 가 있는 dto 리스트를 리턴
        MultiValueMap<String, List> bodyData = new LinkedMultiValueMap<>();
        bodyData.add("prob_no_list", probNoList);
        ResponseEntity<List<LogDto.ProbDetailDto>> probDetailList = restTemplateUtils.sendRequest(
                bodyData,
                "http://i8b303.p.ssafy.io:9001/problem-service/getProbSubjectAndTier",
//                "http://localhost:9001/problem-service/getProbSubjectAndTier",
                new ParameterizedTypeReference<List<LogDto.ProbDetailDto>>() {}
        );

        for (int i = 0; i < battleLogDtoList.size(); i++)
        {
            battleLogDtoList.get(i).setProbNo(probDetailList.getBody().get(i).getProb_no());
            battleLogDtoList.get(i).setProbName(probDetailList.getBody().get(i).getProb_name());
            battleLogDtoList.get(i).setProbTier(probDetailList.getBody().get(i).getProb_tier());
        }

        return battleLogDtoList;
    }

    /**
     *
     * @return 모든 유저의 모드별 mmr, 승리수
     * @throws URISyntaxException
     */
    @Override
    public List<LogDto.UserResultAndMmrDto> getAllResultAndMmr() throws URISyntaxException
    {
        log.info("LogServiceImpl 의 getAllResultANdMmr 메소드 실행");

        // log-service -> user-service
        // return : 모든 user_id 리스트
        ResponseEntity<List<String>> userIdList = restTemplateUtils.sendRequest(
                null,
                "http://i8b303.p.ssafy.io:9000/user-service/getAllUserId",
                new ParameterizedTypeReference<List<String>>() {}
        );

        List<LogDto.UserResultAndMmrDto> list = new ArrayList<>();

        for (String userId : userIdList.getBody())
        {
            BattleLogEntity entityForSpeedMmr = battleLogRepository
                    .findTopByMyUserIdAndBattleModeOrderByBattleLogNoDesc(userId, "speed");

            BattleLogEntity entityForOptimizationMmr = battleLogRepository
                    .findTopByMyUserIdAndBattleModeOrderByBattleLogNoDesc(userId, "optimization");

            Long speedWinCnt = battleLogRepository
                    .countByMyUserIdAndBattleModeAndBattleResult(userId, "speed", 1);

            Long speedLoseCnt = battleLogRepository
                    .countByMyUserIdAndBattleModeAndBattleResult(userId, "speed", 0);

            Long optimizationWinCnt = battleLogRepository
                    .countByMyUserIdAndBattleModeAndBattleResult(userId, "optimization", 1);

            Long optimizationLoseCnt = battleLogRepository
                    .countByMyUserIdAndBattleModeAndBattleResult(userId, "optimization", 0);

            LogDto.UserResultAndMmrDto userResultAndMmrDto =
                    LogDto.UserResultAndMmrDto.builder()
                            .userId(userId)
                            .speedMmr(entityForSpeedMmr == null ? 1000 : entityForSpeedMmr.getNowMmr())
                            .speedWin(speedWinCnt == null ? 0 : speedWinCnt.intValue())
                            .speedLose(speedLoseCnt == null ? 0 : speedLoseCnt.intValue())
                            .optimizationMmr(
                                    entityForOptimizationMmr == null ? 1000 : entityForOptimizationMmr.getNowMmr()
                            )
                            .optimizationWin(optimizationWinCnt == null ? 0 : optimizationWinCnt.intValue())
                            .optimizationLose(optimizationLoseCnt == null ? 0 : optimizationLoseCnt.intValue())
                            .build();

            list.add(userResultAndMmrDto);
        }

        return list;
    }

}
