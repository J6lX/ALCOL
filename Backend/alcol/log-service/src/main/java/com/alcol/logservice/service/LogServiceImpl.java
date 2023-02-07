package com.alcol.logservice.service;

import com.alcol.logservice.dto.LogDto;
import com.alcol.logservice.entity.BattleLogEntity;
import com.alcol.logservice.entity.ExpLogEntity;
import com.alcol.logservice.repository.BattleLogRepository;
import com.alcol.logservice.repository.ExpLogRepository;
import com.alcol.logservice.repository.TestProbSubmitLogRepository;
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
                .exp(expLogEntity.getCurExp())
                .speedMmr(battleLogEntityBySpeed.getNowMmr())
                .optimizationMmr(battleLogEntityByOptimization.getNowMmr())
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
                "http://localhost:9001/problem-service/getProbDetail",
                new ParameterizedTypeReference<List<LogDto.ProbDetailDto>>() {}
        );

        for (int i = 0; i < battleLogDtoList.size(); i++)
        {
            battleLogDtoList.get(i).setProbNo(probDetailList.getBody().get(i).getProbNo());
            battleLogDtoList.get(i).setProbName(probDetailList.getBody().get(i).getProbName());
            battleLogDtoList.get(i).setProbTier(probDetailList.getBody().get(i).getProbTier());
        }

        return battleLogDtoList;
    }
}
