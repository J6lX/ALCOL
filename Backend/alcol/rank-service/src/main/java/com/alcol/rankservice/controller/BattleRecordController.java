package com.alcol.rankservice.controller;

import com.alcol.rankservice.dto.BattleDto;
import com.alcol.rankservice.entity.WinLoseCnt;
import com.alcol.rankservice.service.BattleResultServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.validation.Valid;

@Controller
@RequestMapping("/BattleResult")
public class BattleRecordController
{
    private static BattleResultServiceImpl battleResultService;

    @PostMapping("/a")
    public ResponseEntity<?> example(@Valid @RequestBody BattleDto.Request battleResult){
        System.out.println("배틀 결과 받음");


    }

}
