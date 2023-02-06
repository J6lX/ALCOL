package com.alcol.logservice.service;

import com.alcol.logservice.dto.LogDto;
import com.alcol.logservice.entity.BattleLogEntity;
import com.alcol.logservice.entity.ProbTrialLogEntity;
import com.alcol.logservice.repository.BattleLogRepository;
import com.alcol.logservice.repository.ProbTrialLogRepository;
import com.alcol.logservice.util.RestTemplateUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
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

@Service
public class LogServiceImpl implements LogService
{
    private final ProbTrialLogRepository probTrialLogRepository;
    private final BattleLogRepository battleLogRepository;
    private final RestTemplateUtils restTemplateUtils;

    public LogServiceImpl(
            ProbTrialLogRepository probTrialLogRepository,
            BattleLogRepository battleLogRepository,
            RestTemplateUtils restTemplateUtils
    )
    {
        this.probTrialLogRepository = probTrialLogRepository;
        this.battleLogRepository = battleLogRepository;
        this.restTemplateUtils = restTemplateUtils;
    }

    @Override
    public List<LogDto.UserBattleLogDto> getBattleLog(String userId)
            throws URISyntaxException
    {
        List<BattleLogEntity> battleLogEntityList =
                battleLogRepository.findTop10ByMyUserIdOrderByBattleLogNoDesc(userId);

        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT)
                .setFieldAccessLevel(Configuration.AccessLevel.PRIVATE)
                .setFieldMatchingEnabled(true);

        List<LogDto.UserBattleLogDto> battleLogDtoList = new ArrayList<>();
        List<String> otherUserIdList = new ArrayList<>();
        List<Integer> probNoList = new ArrayList<>();

        for (BattleLogEntity battleLogEntity : battleLogEntityList)
        {
            battleLogDtoList.add(modelMapper.map(battleLogEntity, LogDto.UserBattleLogDto.class));
            otherUserIdList.add(battleLogEntity.getOtherUserId());
            probNoList.add(battleLogEntity.getProbNo());
        }

        // user service 에게 user_id 를 보내서 user nickname 받아오기
        MultiValueMap<String, List> bodyData = new LinkedMultiValueMap<>();
        bodyData.add("user_id_list", otherUserIdList);
        ResponseEntity<List<String>> nickNameList = restTemplateUtils.sendRequest(
                bodyData,
                "http://localhost:9000/user-service/getNicknameList",
                new ParameterizedTypeReference<List<String>>() {}
        );

        // problem service 에 problem no 를 보내서 prob name, prob tier 받아오기
        bodyData = new LinkedMultiValueMap<>();
        bodyData.add("prob_no_list", probNoList);
        ResponseEntity<List<LogDto.ProbDetailDto>> probDetailList = restTemplateUtils.sendRequest(
                bodyData,
                "http://localhost:9001/problem-service/getProbDetail",
                new ParameterizedTypeReference<List<LogDto.ProbDetailDto>>() {}
        );

        return null;
    }

    // user_id 를 받아서 해당 유저의 레벨, 스피드전 티어, 효율성전 티어를 리턴
    @Override
    public LogDto.UserPlayDto getLevelAndTier(String userId)
            throws URISyntaxException
    {
        ProbTrialLogEntity probTrialLogEntity =
                probTrialLogRepository.findTopByUserIdOrderByProbTrialLogNoDesc(userId);

        BattleLogEntity battleLogEntityBySpeed =
                battleLogRepository.findTopByMyUserIdAndBattleModeOrderByBattleLogNoDesc(
                        userId, "speed"
                );

        BattleLogEntity battleLogEntityByOptimization =
                battleLogRepository.findTopByMyUserIdAndBattleModeOrderByBattleLogNoDesc(
                        userId, "optimization"
                );

        int curExp = probTrialLogEntity.getCurExp();
        int nowMmrBySpeed = battleLogEntityBySpeed.getNowMmr();
        int nowMmrByOptimization = battleLogEntityByOptimization.getNowMmr();

        MultiValueMap<String, String> bodyData = new LinkedMultiValueMap<>();
        bodyData.add("cur_exp", curExp + "");
        bodyData.add("now_mmr_by_speed", nowMmrBySpeed + "");
        bodyData.add("now_mmr_by_optimization", nowMmrByOptimization + "");
        String url = "http://localhost:9000/user-service/getLevelAndTier";

        // log-service -> user-service
        // user-service 에게 현재 경험치, 현재 스피드전 mmr, 현재 효율성전 mmr 을 보내서
        // 해당 유저의 레벨, 스피드전 티어, 효율성전 티어를 리턴받음
        ResponseEntity<LogDto.UserPlayDto> response = restTemplateUtils.sendRequest(
                bodyData,
                url,
                new ParameterizedTypeReference<LogDto.UserPlayDto>() {}
        );

        return response.getBody();
    }
}
