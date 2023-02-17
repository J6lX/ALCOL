package com.alcol.logservice.controller;

import com.alcol.logservice.dto.LogDto;
import com.alcol.logservice.service.LogService;
import com.alcol.logservice.util.RestTemplateUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/log-service")
@Slf4j
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class LogController
{
    private final LogService logService;
    private final RestTemplateUtils restTemplateUtils;

    public LogController(LogService logService, RestTemplateUtils restTemplateUtils)
    {
        this.logService = logService;
        this.restTemplateUtils = restTemplateUtils;
    }

    /**
     * @param userId
     * @return 해당 유저의 경험치, 스피드전 mmr, 효율성전 mmr 을 리턴
     */
    @PostMapping(value = "/getExpAndMmr")
    public ResponseEntity<LogDto.UserPlayDto> getExpAndMmr(@RequestParam(value="user_id") String userId)
    {
        LogDto.UserPlayDto userPlayDto = logService.getExpAndMmr(userId);
        return restTemplateUtils.sendResponse(userPlayDto);
    }

    /**
     * @param userId
     * @return 해당 유저의 배틀 로그 리스트를 리턴
     */
    @PostMapping("/getBattleLog")
    public ResponseEntity<List<LogDto.UserBattleLogDto>> getBattleLog(@RequestParam(value="user_id") String userId)
            throws URISyntaxException
    {
        log.info("LogController 의 getBattleLog 메소드 실행");
        List<LogDto.UserBattleLogDto> list = logService.getBattleLog(userId);
        return restTemplateUtils.sendResponse(list);
    }

    @PostMapping("/getPastSeasonLog")
    public ResponseEntity<List<LogDto.UserSeasonLogDto>> getPastSeasonLog(@RequestBody HashMap<String, Object> param)
    {
        log.info("LogController 의 getPastSeasonLog 메소드 실행");
        List<LogDto.UserSeasonLogDto> list = logService.getPastSeasonLog(param.get("user_id") + "");
        return restTemplateUtils.sendResponse(list);
    }

    /**
     * @return 모든 유저의 승패정보와 mmr 을 리턴
     * @throws URISyntaxException
     */
    @GetMapping("/getAllResultAndMmr")
    public List<LogDto.UserResultAndMmrDto> getAllResultAndMmr()
            throws URISyntaxException
    {
        log.info("LogController 의 getAllResultAndMmr 메소드 실행");
        List<LogDto.UserResultAndMmrDto> list = logService.getAllResultAndMmr();
        return list;
    }

    /**
     * 경험치 저장
     * @param map
     * @return 성공 시 0, 실패 시 1
     */
    @PostMapping("/insertExp")
    public int insertExp(@RequestBody Map<String, Object> map) throws URISyntaxException {
        log.info("LogController 의 insertExp 메소드 실행");
        String userId = map.get("user_id") + "";
        int addExp = Integer.parseInt(map.get("add_exp") + "");
        log.info("LogController 의 insertExp 메소드 실행 완료");
        return logService.insertExp(userId, addExp);
    }

    /**
     * 배틀 로그 저장(승, 패)
     * @param map
     * @return
     */
    @PostMapping("/insertBattleLog")
    public String insertBattleLog(@RequestBody Map<String, Object> map) throws URISyntaxException {
        log.info("LogController 의 insertBattleLog 메소드 실행");

        log.info("insertBattleLog 분기 1");

        String battleMode = (String)map.get("battleMode");
        long probNum = new Long((int)map.get("probNum"));

        log.info("insertBattleLog 분기 2");

        String winnerUserId = (String)map.get("winnerUserId");
        int winnerPrevMmr = (int)map.get("winnerPrevMmr");
        int winnerNowMmr = (int)map.get("winnerNowMmr");

        String loserUserId = (String)map.get("loserUserId");
        int loserPrevMmr = (int)map.get("loserPrevMmr");
        int loserNowMmr = (int)map.get("loserNowMmr");

        List<Map<String, Object>> winnerSubmitLog = (List<Map<String, Object>>) map.get("winnerSubmitLog");
        List<Map<String, Object>> loserSubmitLog = (List<Map<String, Object>>) map.get("loserSubmitLog");

        log.info("insertBattleLog 분기 3");

        List<LogDto.BattleProbSubmitLogDto> winnerSubmitLogList = new ArrayList<>();
        List<LogDto.BattleProbSubmitLogDto> loserSubmitLogList = new ArrayList<>();

        LogDto.BattleLogDto winnerBattleLogDto = LogDto.BattleLogDto.builder()
                .myUserId(winnerUserId)
                .otherUserId(loserUserId)
                .battleMode(battleMode)
                .probNo(probNum)
                .battleResult(1)
                .upDownMmr(winnerNowMmr - winnerPrevMmr)
                .nowMmr(winnerNowMmr)
                .endTime(LocalDateTime.now())
                .build();

        LogDto.BattleLogDto loserBattleLogDto = LogDto.BattleLogDto.builder()
                .myUserId(loserUserId)
                .otherUserId(winnerUserId)
                .battleMode(battleMode)
                .probNo(probNum)
                .battleResult(0)
                .upDownMmr(loserNowMmr - loserPrevMmr)
                // 게임에서 졌을 경우 mmr 이 0 점 아래로는 떨어지지 않도록 처리
                .nowMmr(loserNowMmr < 0 ? 0 : loserNowMmr)
                .endTime(LocalDateTime.now())
                .build();

        for (Map<String, Object> submitLog : winnerSubmitLog)
        {
            int isCorrect = submitLog.get("result").equals("Accepted") ? 1 : 0;
            int time = Integer.parseInt(submitLog.get("time") + "");
            int memory = Integer.parseInt(submitLog.get("memory") + "");

            winnerSubmitLogList.add(
                    LogDto.BattleProbSubmitLogDto.builder()
                            .isCorrect(isCorrect)
                            .probRunningTime(time)
                            .probRunningMemory(memory)
                            .submitTime(LocalDateTime.now())
                            .build()
            );
        }

        for (Map<String, Object> submitLog : loserSubmitLog)
        {
            int isCorrect = submitLog.get("result").equals("Accepted") ? 1 : 0;
            int time = Integer.parseInt(submitLog.get("time") + "");
            int memory = Integer.parseInt(submitLog.get("memory") + "");

            loserSubmitLogList.add(
                    LogDto.BattleProbSubmitLogDto.builder()
                            .isCorrect(isCorrect)
                            .probRunningTime(time)
                            .probRunningMemory(memory)
                            .submitTime(LocalDateTime.now())
                            .build()
            );
        }

        // 승리한 유저는 경험치 100, 패배한 유저는 경험치 50 을 획득
        logService.insertExp(winnerUserId, 100);
        logService.insertExp(loserUserId, 50);

        log.info("insertBattleLog 분기 4");

        logService.insertBattleLog(winnerBattleLogDto, loserBattleLogDto, winnerSubmitLogList, loserSubmitLogList);

        log.info("LogController 의 insertBattleLog 메소드 실행 완료");

        return "Log Service : battleLog Insert Success";
    }

    /**
     * 배틀 로그 저장(무)
     * @param map
     * @return
     */
    @PostMapping("/insertBattleLogByDraw")
    public String insertBattleLogByDraw(@RequestBody Map<String, Object> map) throws URISyntaxException {
        log.info("LogController 의 insertBattleLogByDraw 메소드 실행");

        log.info("insertBattleLogByDraw 분기 1");

        String battleMode = (String)map.get("battleMode");
        long probNum = new Long((int)map.get("probNum"));

        log.info("insertBattleLogByDraw 분기 2");

        String userId = (String)map.get("userId");
        int userNowMmr = (int)map.get("userNowMmr");
        int userPrevMmr = (int)map.get("userPrevMmr");

        String otherId = (String)map.get("otherId");
        int otherNowMmr = (int)map.get("otherNowMmr");
        int otherPrevMmr = (int)map.get("otherPrevMmr");

        List<Map<String, Object>> userSubmitLog = (List<Map<String, Object>>) map.get("userSubmitLog");
        List<Map<String, Object>> otherSubmitLog = (List<Map<String, Object>>) map.get("otherSubmitLog");

        log.info("insertBattleLogByDraw 분기 3");

        List<LogDto.BattleProbSubmitLogDto> userSubmitLogList = new ArrayList<>();
        List<LogDto.BattleProbSubmitLogDto> otherSubmitLogList = new ArrayList<>();

        LogDto.BattleLogDto userBattleLogDto = LogDto.BattleLogDto.builder()
                .myUserId(userId)
                .otherUserId(otherId)
                .battleMode(battleMode)
                .probNo(probNum)
                .battleResult(2)
                .upDownMmr(userNowMmr - userPrevMmr)
                // 게임에서 졌을 경우 mmr 이 0 점 아래로는 떨어지지 않도록 처리
                .nowMmr(userNowMmr < 0 ? 0 : userNowMmr)
                .endTime(LocalDateTime.now())
                .build();

        LogDto.BattleLogDto otherBattleLogDto = LogDto.BattleLogDto.builder()
                .myUserId(otherId)
                .otherUserId(userId)
                .battleMode(battleMode)
                .probNo(probNum)
                .battleResult(2)
                .upDownMmr(otherNowMmr - otherPrevMmr)
                // 게임에서 졌을 경우 mmr 이 0 점 아래로는 떨어지지 않도록 처리
                .nowMmr(otherNowMmr < 0 ? 0 : otherNowMmr)
                .endTime(LocalDateTime.now())
                .build();

        for (Map<String, Object> submitLog : userSubmitLog)
        {
            int isCorrect = submitLog.get("result").equals("Accepted") ? 1 : 0;
            int time = Integer.parseInt(submitLog.get("time") + "");
            int memory = Integer.parseInt(submitLog.get("memory") + "");

            userSubmitLogList.add(
                    LogDto.BattleProbSubmitLogDto.builder()
                            .isCorrect(isCorrect)
                            .probRunningTime(time)
                            .probRunningMemory(memory)
                            .submitTime(LocalDateTime.now())
                            .build()
            );
        }

        for (Map<String, Object> submitLog : otherSubmitLog)
        {
            int isCorrect = submitLog.get("result").equals("Accepted") ? 1 : 0;
            int time = Integer.parseInt(submitLog.get("time") + "");
            int memory = Integer.parseInt(submitLog.get("memory") + "");

            otherSubmitLogList.add(
                    LogDto.BattleProbSubmitLogDto.builder()
                            .isCorrect(isCorrect)
                            .probRunningTime(time)
                            .probRunningMemory(memory)
                            .submitTime(LocalDateTime.now())
                            .build()
            );
        }

        // 무승부 시 두 명의 유저 모두 경험치 75 획득
        logService.insertExp(userId, 75);
        logService.insertExp(otherId, 75);

        log.info("insertBattleLogByDraw 분기 4");

        logService.insertBattleLog(userBattleLogDto, otherBattleLogDto, userSubmitLogList, otherSubmitLogList);

        log.info("LogController 의 insertBattleLogByDraw 메소드 실행 완료");

        return "Log Service : battleLog Insert By Draw Success";
    }
}
