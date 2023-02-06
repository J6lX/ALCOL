package com.alcol.rankservice.controller;

import com.alcol.rankservice.dto.BattleDto;
import com.alcol.rankservice.dto.RankDto;
import com.alcol.rankservice.dto.WinLoseDto;
import com.alcol.rankservice.service.BattleResultService;
import com.alcol.rankservice.service.RankService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.Map;

@Controller
@RequestMapping("/")
@RequiredArgsConstructor
@Slf4j
public class BattleRecordController
{
    private final BattleResultService battleResultService;
    private final RankService rankService;

    @PostMapping("/BattleResult")
    public ResponseEntity<String> battleEnd(@Valid @RequestBody BattleDto.Request battleResult)
    {
        // 승패 count를 세기 위해 redis에 저장하는 작업
        WinLoseDto winLose = new WinLoseDto(battleResult.getUser_id_1(), battleResult.getBattle_mode(), battleResult.getWin_1());
        battleResultService.recordCnt(winLose);
        winLose = new WinLoseDto(battleResult.getUser_id_2(), battleResult.getBattle_mode(), battleResult.getWin_2());
        battleResultService.recordCnt(winLose);

        // ranking 순위를 바꾸기 위해 mmr 값으로 sort하는 작업
        battleResultService.recordRank(battleResult.getBattle_mode() ,battleResult.getMmr_1(), battleResult.getUser_id_1());
        battleResultService.recordRank(battleResult.getBattle_mode() ,battleResult.getMmr_2(), battleResult.getUser_id_2());

        // 랭킹 페이지에서 유저 정보를 보여주기 위해 사용자 정보를 저장해놓는 작업
        //        battleResultService.recordUserData(battleResult.getUser_id_1());
//        battleResultService.recordUserData(battleResult.getUser_id_2());

        return ResponseEntity.status(HttpStatus.OK).body("OK");
    }

    @PostMapping("/myRank")
    public ResponseEntity<RankDto.Ranking> requestMySpeedRank(HttpServletRequest requestHeader, @RequestBody Map<String, String> requestMap){
        // header에 있는 user_id값 가져옴
        String userId = requestHeader.getHeaders("user_id").nextElement();
        String battleMode = requestMap.get("battle_mode");

        // redis의 랭킹 부분에서 해당 유저의 mmr값이 존재하는지 확인
        int mmr = rankService.getMyRank(userId, battleMode);

        // mmr이 -1이면 해당 유저는 배틀을 진행한 적이 없는 유저이다.
        if(mmr == -1){
            RankDto.UserData userData = rankService.getUserData(userId);
            RankDto.Ranking rank = RankDto.Ranking.builder()
                    .nickname(userData.getNickname())
                    .profile_pic(userData.getStored_file_name())
                    .level(userData.getLevel())
                    .tier("none")
                    .mmr(-1)
                    .winCnt(-1)
                    .loseCnt(-1)
                    .winningRate(-1)
                    .grade(-1)
                    .build();

            return ResponseEntity.status(HttpStatus.OK).body(rank);
        }
        // mmr이 -1이 아니라면 배틀을 진행한 적이 있는 유저이다.
        // 그렇다면 ranking에서 순위, mmr값을 가져오고 win/lose count도 가져와야 한다.

        RankDto.UserData userData = rankService.getUserData(userId);
        RankDto.WinLoseCount winLoseCount = rankService.getWinLoseCount(userId, battleMode);
        RankDto.RankingAndMMR rankingAndMMR = rankService.getRankingAndMMR(userId, battleMode);

        RankDto.Ranking rank = RankDto.Ranking.builder()
                .nickname(userData.getNickname())
                .profile_pic(userData.getStored_file_name())
                .level(userData.getLevel())
                .tier(userData.getSpeed_tier())
                .mmr(rankingAndMMR.getMMR())
                .winCnt(winLoseCount.getWin())
                .loseCnt(winLoseCount.getLose())
                .winningRate(winLoseCount.getWinningRate())
                .grade(rankingAndMMR.getGrade() + 1)
                .build();

        return ResponseEntity.status(HttpStatus.OK).body(rank);
    }
}
