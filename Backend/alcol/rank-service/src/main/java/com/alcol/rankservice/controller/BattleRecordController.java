package com.alcol.rankservice.controller;

import com.alcol.rankservice.dto.BattleDto;
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

import javax.validation.Valid;

@Controller
@RequestMapping("/")
@RequiredArgsConstructor
@Slf4j
public class BattleRecordController
{
    private final BattleResultService battleResultService;

    @PostMapping("/BattleResult")
    public ResponseEntity<String> example(@Valid @RequestBody BattleDto.Request battleResult)
    {
        // 승패 count를 세기 위해 redis에 저장하는 작업
        WinLose winLose = new WinLose(battleResult.getUser_id_1(), battleResult.getBattle_mode(), battleResult.getWin_1());
        battleResultService.recordCnt(winLose);
        winLose = new WinLose(battleResult.getUser_id_2(), battleResult.getBattle_mode(), battleResult.getWin_2());
        battleResultService.recordCnt(winLose);

        battleResultService.recordRank(battleResult.getBattle_mode() ,battleResult.getMmr_1(), battleResult.getUser_id_1());
        battleResultService.recordRank(battleResult.getBattle_mode() ,battleResult.getMmr_2(), battleResult.getUser_id_2());
        battleResultService.recordUserData(battleResult.getUser_id_1());

        return ResponseEntity.status(HttpStatus.OK).body("OK");
    }
}
