package com.alcol.logservice.service;

import com.alcol.logservice.entity.BattleLogEntity;
import com.alcol.logservice.entity.ProbTrialLogEntity;
import com.alcol.logservice.repository.BattleLogRepository;
import com.alcol.logservice.repository.ProbTrialLogRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.List;

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

    @Override
    public List<String> getLevelAndTier(String userId)
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
        bodyData.add("curExp", curExp + "");
        bodyData.add("nowMmrBySpeed", nowMmrBySpeed + "");
        bodyData.add("nowMmrByOptimization", nowMmrByOptimization + "");
        String url = "http://localhost:9000/user-service/getLevelAndTier";

        // 여기는 로그 서비스!!!
        // 리턴받은 리스트에는 레벨, 스피드전 티어, 효율성전 티어가 순서대로 있음
        // 인덱스 0 : 레벨
        // 인덱스 1 : 스피드전 티어
        // 인덱스 2 : 효율성전 티어
        ResponseEntity<List> response = restTemplate.postForEntity(
                url,
                bodyData,
                List.class
        );

        return response.getBody();

//        // user-service 로 요청
//        UserLevelEntity userLevelEntity =
//                userLevelRepository.findTopBySumExpLessThanEqualOrderByLevelDesc(curExp);
//        UserTierEntity userTierEntityBySpeed =
//                userTierRepository.findByMinMmrLessThanEqualAndMaxMmrGreaterThanEqual(
//                        nowMmrBySpeed, nowMmrBySpeed
//                );
//        UserTierEntity userTierEntityByOptimization =
//                userTierRepository.findByMinMmrLessThanEqualAndMaxMmrGreaterThanEqual(
//                        nowMmrByOptimization, nowMmrByOptimization
//                );
//
//        int level = userLevelEntity.getLevel();
//        String tierBySpeed = userTierEntityBySpeed.getTier();
//        String tierByOptimization = userTierEntityByOptimization.getTier();
    }
}
