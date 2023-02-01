package com.alcol.rankservice.controller;

import com.alcol.rankservice.dto.BattleDto;
import com.alcol.rankservice.entity.Rank;
import com.alcol.rankservice.entity.WinLose;
import com.alcol.rankservice.service.BattleResultService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.RestTemplate;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/")
@RequiredArgsConstructor
@Slf4j
public class BattleRecordController
{
    private final BattleResultService battleResultService;
    private final RestTemplate restTemplate;

    @PostMapping("/BattleResult")
    public ResponseEntity<BattleDto.Response> example(@Valid @RequestBody BattleDto.Request battleResult){
        // 승패 count를 세기 위해 redis에 저장하는 작업
        WinLose winLose = new WinLose(battleResult.getUser_id_1(), battleResult.getBattle_mode(), battleResult.getWin_1());
        battleResultService.recordResult(winLose);
        winLose = new WinLose(battleResult.getUser_id_2(), battleResult.getBattle_mode(), battleResult.getWin_2());

        /*
        // 여기 되는지 확인
        Map<String, String> map = new HashMap<>();
        map.put("userId", battleResult.getUser_id_1());
        String url = "http://localhost:9000/user-service/getUserInfo";
        Rank.ReceivedUserData userInfo = restTemplate.postForObject(url, map, Rank.ReceivedUserData.class);

//        System.out.println(userInfo.toString());
        battleResultService.recordRank(userInfo, battleResult.getBattle_mode() ,battleResult.getMmr_1());
*/

        return ResponseEntity.status(HttpStatus.OK).body(battleResultService.recordResult(winLose));
    }

}
