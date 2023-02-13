//package com.alcol.logservice.controller;
//
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@RestController
//@Slf4j
//@RequestMapping("/test-service")
//@CrossOrigin(origins = "*", allowedHeaders = "*")
//public class TestController
//{
//    @GetMapping("/test")
//    public void test()
//    {
//        String url_log = "http://i8b303.p.ssafy.io:9005/log-service/insertBattleLog";
//        BattleRoom battleRoomJson = sessionId2Obj.get(userId2SessionId.get(submitUserId));
//
//        Map<String, Object> sendBattleLog = new HashMap<>();
//        sendBattleLog.put("battleMode", "a");
//        sendBattleLog.put("probNum", "b");
//        sendBattleLog.put("winnerUserId", "c");
//        sendBattleLog.put("winnerPrevMmr", "d");
//        sendBattleLog.put("winnerNowMmr", "e");
//        sendBattleLog.put("winnerSubmitLog", "g");
//        sendBattleLog.put("loserUserId", "g");
//        sendBattleLog.put("loserPrevMmr", "h");
//        sendBattleLog.put("loserNowMmr", "i");
//        sendBattleLog.put("loserSubmitLog", "j");
//
//        String getBattleLogSaveResult = restTemplate.postForObject(
//                url_log,
//                sendBattleLog,
//                String.class
//        );
//
//        System.out.println(getBattleLogSaveResult);
//    }
//}
