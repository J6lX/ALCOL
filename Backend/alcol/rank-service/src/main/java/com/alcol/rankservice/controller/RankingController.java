package com.alcol.rankservice.controller;

import com.alcol.rankservice.dto.BattleDto;
import com.alcol.rankservice.dto.RankDto;
import com.alcol.rankservice.dto.WinLoseDto;
import com.alcol.rankservice.service.BattleResultService;
import com.alcol.rankservice.service.RankService;
import com.alcol.rankservice.error.CustomStatusCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import com.alcol.rankservice.util.ApiUtils;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/rank-service")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class RankingController
{
    private final BattleResultService battleResultService;
    private final RankService rankService;

    @PostMapping("/battleResult")
    public ResponseEntity<String> battleEnd(@Valid @RequestBody BattleDto.Request battleResult)
    {
        // 우승자 데이터에 따라 분기처리
        // 0: 무승부, 1: 1번 유저 승리, 2: 2번 유저 승리
        int user1Result = 0;
        int user2Result = 0;
        // 1번 유저 승리
        if(battleResult.getWinner().equals("1"))
        {
            user1Result = 1;
        }
        // 2번 유저 승리
        else
        {
            user2Result = 1;
        }
        
        // 결과가 무승부가 아니라면
        if(!battleResult.getWinner().equals("0")) {
            // 승패 count를 세기 위해 redis에 저장하는 작업
            // user1
            WinLoseDto winLose = new WinLoseDto(battleResult.getUser_id_1(), battleResult.getBattle_mode(), user1Result);
            // 승패수를 기록하는 과정에서 오류가 발생했을 시
            if (!battleResultService.recordCnt(winLose)) {
                return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("WIN/LOSE COUNT ERROR");
            }
            // user2
            winLose = new WinLoseDto(battleResult.getUser_id_2(), battleResult.getBattle_mode(), user2Result);
            if (!battleResultService.recordCnt(winLose)) {
                return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("WIN/LOSE COUNT ERROR");
            }
        }


        // ranking 순위를 바꾸기 위해 mmr 값을 업데이트 하면서 sort하는 작업
        if(!battleResultService.recordRank(battleResult.getBattle_mode() ,Integer.parseInt(battleResult.getMmr_1()), battleResult.getUser_id_1()))
        {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("RANKING UPDATE ERROR");
        }
        if(!battleResultService.recordRank(battleResult.getBattle_mode() ,Integer.parseInt(battleResult.getMmr_2()), battleResult.getUser_id_2()))
        {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("RANKING UPDATE ERROR");
        }

        // 랭킹 페이지에서 유저 정보를 보여주기 위해 사용자 정보를 저장해놓는 작업
        if(!battleResultService.recordUserData(battleResult.getUser_id_1()))
        {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("ADD USERINFO IN REDIS ERROR");
        }
        if(!battleResultService.recordUserData(battleResult.getUser_id_2()))
        {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("ADD USERINFO IN REDIS ERROR");
        }

        return ResponseEntity.status(HttpStatus.OK).body("SUCCESS");
    }

    @PostMapping("/myRank")
    public ResponseEntity<RankDto.ResponseDto<?>> requestMyRank(HttpServletRequest requestHeader, @RequestBody Map<String, String> requestMap){
        // header에 있는 user_id값 가져옴
        String userId = requestHeader.getHeaders("user_id").nextElement();
        String battleMode = requestMap.get("battle_mode");

        // redis의 랭킹 부분에서 해당 유저가 승패 기록이 있는지 확인
        RankDto.WinLoseCount confirmUserRecord = rankService.getWinLoseCount(userId, battleMode);

        // confirmUserRecord값이 null이면 해당 유저는 배틀을 진행한 적이 없는 유저이다.
        if(confirmUserRecord == null){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiUtils.error(CustomStatusCode.BATTLE_RECORD_NOT_EXIST));
        }
        // confirmUserRecord값이 null이 아니라면 배틀을 진행한 적이 있는 유저이다.
        RankDto.Ranking myRank = rankService.responseUserInfo(userId, battleMode);

        return ResponseEntity.status(HttpStatus.OK).body(ApiUtils.success(myRank, CustomStatusCode.BATTLE_RECORD_EXIST));
    }

    @GetMapping("/rankList")
    public ResponseEntity<RankDto.ResponseDto<?>> requestAllRankingList(@RequestParam String battle_mode, int page)
    {
        List<RankDto.Ranking> RankingList = rankService.getAllRankingList(battle_mode, page);
        if(RankingList.size() == 0)
        {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiUtils.error(CustomStatusCode.ALL_USER_BATTLE_RANKING_NOT_EXIST));
        }
        return ResponseEntity.status(HttpStatus.OK).body(ApiUtils.success(RankingList, CustomStatusCode.ALL_USER_BATTLE_RANKING_EXIST));
    }

    @GetMapping("/searchUser")
    public ResponseEntity<RankDto.ResponseDto<?>> requestSearchUser(@RequestParam String battle_mode, String nickname)
    {
        RankDto.Ranking searchUser = rankService.getSearchUserInfo(battle_mode, nickname);

        if(searchUser == null){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiUtils.error(CustomStatusCode.SEARCH_USER_NOT_EXIST));
        }
        return ResponseEntity.status(HttpStatus.OK).body(ApiUtils.success(searchUser, CustomStatusCode.SEARCH_USER_EXIST));
    }

    @GetMapping("/getTop3")
    public ResponseEntity<RankDto.ResponseDto<?>> requestTop3User()
    {
        Map<String, List<RankDto.Top3Ranking>> top3List = rankService.getTop3UserList();

        if(top3List == null)
        {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiUtils.error(CustomStatusCode.SEARCH_TOP3_NOT_EXIST));
        }
        return ResponseEntity.status(HttpStatus.OK).body(ApiUtils.success(top3List, CustomStatusCode.SEARCH_TOP3_EXIST));
    }

}
