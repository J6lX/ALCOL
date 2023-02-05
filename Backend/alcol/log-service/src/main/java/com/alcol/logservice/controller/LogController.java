package com.alcol.logservice.controller;

import com.alcol.logservice.dto.LogDto;
import com.alcol.logservice.service.LogService;
import com.alcol.logservice.util.RestTemplateUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/log-service")
@Slf4j
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
     * user-service 에서 user_id 를 넘겨주면 해당 유저의 레벨, 스피드전 티어, 효율성전 티어를 리턴
     * @param userId
     * @return
     */
    @PostMapping(value = "/getLevelAndTier")
    public ResponseEntity<LogDto.UserPlayDto> getLevelAndTier(@RequestParam(value="user_id") String userId)
    {
        LogDto.UserPlayDto userPlayDto = logService.getLevelAndTier(userId);
        return restTemplateUtils.sendResponse(userPlayDto);
    }

    @PostMapping("/test")
    public ResponseEntity<List<LogDto.UserPlayDto>> test
            (
                    @RequestParam(value = "prob_no_list") List<String> probNoList
            )
    {
        List<LogDto.UserPlayDto> ret = new ArrayList<>();
        ret.add(new LogDto.UserPlayDto(probNoList.get(0), "g", "g"));
        ret.add(new LogDto.UserPlayDto(probNoList.get(1), "s", "s"));
        ret.add(new LogDto.UserPlayDto(probNoList.get(2), "b", "b"));
        return restTemplateUtils.sendResponse(ret);
    }
}
