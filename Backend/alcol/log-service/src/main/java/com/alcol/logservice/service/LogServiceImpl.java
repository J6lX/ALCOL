package com.alcol.logservice.service;

import com.alcol.logservice.dto.LogDto;
import com.alcol.logservice.entity.BattleLogEntity;
import com.alcol.logservice.entity.ProbTrialLogEntity;
import com.alcol.logservice.repository.BattleLogRepository;
import com.alcol.logservice.repository.ProbTrialLogRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class LogServiceImpl implements LogService
{
    private final ProbTrialLogRepository probTrialLogRepository;
    private final BattleLogRepository battleLogRepository;

    private final RestTemplate restTemplate;

    public LogServiceImpl(
            ProbTrialLogRepository probTrialLogRepository,
            BattleLogRepository battleLogRepository,
            RestTemplate restTemplate
    )
    {
        this.probTrialLogRepository = probTrialLogRepository;
        this.battleLogRepository = battleLogRepository;
        this.restTemplate = restTemplate;
    }

    // user_id 를 받아서 해당 유저의 레벨, 스피드전 티어, 효율성전 티어를 리턴
    @Override
    public LogDto.UserPlayDto getLevelAndTier(String userId)
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
        ResponseEntity<LogDto.UserPlayDto> response = restTemplate.postForEntity(
                url,
                bodyData,
                LogDto.UserPlayDto.class
        );

        return response.getBody();
    }
}
