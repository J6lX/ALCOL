package com.alcol.logservice.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/log-service")
@Slf4j
public class LogController
{
    // RestTemplate 을 통한 서비스 간 호출 테스트
    @PostMapping("/getLog")
    public List<String> getLog(@RequestParam(value="param") String plusData)
    {
        log.info("user-service -> log-service 호출 완료!!");
        log.info("log-service 로 전달된 plusData", plusData);
        List<String> logs = new ArrayList<>();
        for (int i = 1; i <= 5; i++)
        {
            logs.add("Log data " + i);
        }
        logs.add(plusData);
        return logs;
    }

}
