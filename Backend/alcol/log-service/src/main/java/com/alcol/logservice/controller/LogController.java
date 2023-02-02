package com.alcol.logservice.controller;

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

    @PostMapping("/getLevelAndTier")
    public List<String> getLevelAndTier(@RequestParam(value="user_id") String userId)
    {
        return logService.getLevelAndTier(userId);
    }
}
