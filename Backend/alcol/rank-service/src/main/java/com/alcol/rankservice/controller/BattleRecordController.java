package com.alcol.rankservice.controller;

import com.alcol.rankservice.dto.BattleDto;
import com.alcol.rankservice.entity.WinLose;
import com.alcol.rankservice.service.BattleResultService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.Enumeration;
import java.util.Map;

@Controller
@RequestMapping("/")
@RequiredArgsConstructor
@Slf4j
public class BattleRecordController
{
    private final BattleResultService battleResultService;

    @PostMapping("/BattleResult")
    public ResponseEntity<String> battleEnd(@Valid @RequestBody BattleDto.Request battleResult)
    {
        // 승패 count를 세기 위해 redis에 저장하는 작업
        WinLose winLose = new WinLose(battleResult.getUser_id_1(), battleResult.getBattle_mode(), battleResult.getWin_1());
        battleResultService.recordCnt(winLose);
        winLose = new WinLose(battleResult.getUser_id_2(), battleResult.getBattle_mode(), battleResult.getWin_2());
        battleResultService.recordCnt(winLose);

        // ranking 순위를 바꾸기 위해 mmr 값으로 sort하는 작업
        battleResultService.recordRank(battleResult.getBattle_mode() ,battleResult.getMmr_1(), battleResult.getUser_id_1());
        battleResultService.recordRank(battleResult.getBattle_mode() ,battleResult.getMmr_2(), battleResult.getUser_id_2());

        // 랭킹 페이지에서 유저 정보를 보여주기 위해 사용자 정보를 저장해놓는 작업
        //        battleResultService.recordUserData(battleResult.getUser_id_1());
//        battleResultService.recordUserData(battleResult.getUser_id_2());

        return ResponseEntity.status(HttpStatus.OK).body("OK");
    }

    @PostMapping("/mySpeedRank")
    public ResponseEntity<String> requestMySpeedRank(HttpServletRequest requestHeader, @RequestBody Map<String, String> requestMap){
        // header에 있는 user_id값 가져옴
        String userId = requestHeader.getHeaders("user_id").nextElement();
        String battleMode = requestMap.get("battle_mode");

        // redis의 랭킹 부분에서 해당 유저의 mmr값이 존재하는지 확인
        int mmr = battleResultService.getMySpeedRank(userId, battleMode);

        // mmr이 -1이면 해당 유저는 배틀을 진행한적이 없는 유저이다.
        if(mmr == -1){

        }
        return ResponseEntity.status(HttpStatus.OK).body("ㅎㄵ");
    }
}
