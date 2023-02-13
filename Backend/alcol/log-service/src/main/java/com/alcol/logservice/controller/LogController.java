package com.alcol.logservice.controller;

import com.alcol.logservice.dto.LogDto;
import com.alcol.logservice.service.LogService;
import com.alcol.logservice.util.RestTemplateUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.time.LocalDateTime;
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

    @PostMapping("/insertBattleLog")
    public String insertBattleLog(@RequestBody Map<String, Object> map)
    {
        log.info("LogController 의 insertBattleLog 메소드 실행");

        log.info("battleMode : " + map.get("battleMode"));
        log.info("probNum : " + map.get("probNum"));
        log.info("winnerUserId : " + map.get("winnerUserId"));
        log.info("winnerPrevMmr : " + map.get("winnerPrevMmr"));
        log.info("winnerNowMmr : " + map.get("winnerNowMmr"));
        log.info("winnerSubmitLog : " + map.get("winnerSubmitLog"));
        log.info("loserUserId : " + map.get("loserUserId"));
        log.info("loserPrevMmr : " + map.get("loserPrevMmr"));
        log.info("loserNowMmr : " + map.get("loserNowMmr"));
        log.info("loserSubmitLog : " + map.get("loserSubmitLog"));

        log.info("LogController 분기 1");

        String battleMode = (String)map.get("battleMode");
        Long probNum = (Long)map.get("probNum");

        log.info("LogController 분기 2");

        String winnerUserId = (String)map.get("winnerUserId");
        int winnerPrevMmr = (int)map.get("winnerPrevMmr");
        int winnerNowMmr = (int)map.get("winnerNowMmr");

        log.info("LogController 분기 3");

        String loserUserId = (String)map.get("loserUserId");
        int loserPrevMmr = (int)map.get("loserPrevMmr");
        int loserNowMmr = (int)map.get("loserNowMmr");

        log.info("LogController 분기 4");

        List<Map<String, Object>> winnerSubmitLog = (List<Map<String, Object>>) map.get("winnerSubmitLog");
        List<Map<String, Object>> loserSubmitLog = (List<Map<String, Object>>) map.get("loserSubmitLog");

        log.info("LogController 분기 5");

        for (Map<String, Object> map2 : winnerSubmitLog)
        {
            log.info("result : " + map2.get("result"));
            log.info("time : " + map2.get("time"));
            log.info("memory : " + map2.get("memory"));
        }

        log.info("LogController 분기 6");

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
                .nowMmr(loserNowMmr)
                .endTime(LocalDateTime.now())
                .build();

        logService.insertBattleLog(winnerBattleLogDto, loserBattleLogDto);

        log.info("LogController 의 insertBattleLog 메소드 실행 완료");

        return "Log Service : battleLog Insert Success";
    }

}
