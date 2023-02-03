package com.alcol.logservice.controller;

import com.alcol.logservice.TestDto;
import com.alcol.logservice.service.LogService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/log-service")
@Slf4j
public class LogController
{
    private final LogService logService;

    public LogController(LogService logService)
    {
        this.logService = logService;
    }

    // user-service 에서 user_id 를 넘겨주면 해당 유저의 레벨, 스피드전 티어, 효율성전 티어를 리턴
    @PostMapping("/getLevelAndTier")
    public List<TestDto> getLevelAndTier(@RequestParam(value="user_id") String userId)
    {
        return logService.getLevelAndTier(userId);
    }
}
