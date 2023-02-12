package com.alcol.logservice.controller;

import com.alcol.logservice.dto.LogDto;
import com.alcol.logservice.service.LogService;
import com.alcol.logservice.util.RestTemplateUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.List;

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

}
