package com.alcol.rankservice.service;

import com.alcol.rankservice.dto.RankDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class RankServiceImpl implements RankService{
    private final RedisTemplate<String, Object> redisTemplate;
    private ZSetOperations<String, Object> ranking;
    private HashOperations<String, String, Long> winLoseCount;
    private final RestTemplate restTemplate;


    /**
     * 스피드전 개인 랭킹 가져오기
     */
    public int getMyRank(String userId, String mode)
    {
        // 1. 해당 userId가 redis에 있는 ranking에 MMR 값이 존재하는지 확인
        ranking = redisTemplate.opsForZSet();
        String key = mode;
        String member = userId;
        int mmr = -1;

        try {
            mmr = ranking.score(key, member).intValue();
        } catch(NullPointerException e){
            log.debug("mmr값이 존재하지 않음!!!!!!!!");
            return -1;
        } catch (Exception e){
            log.error("개인 스피드전 랭킹을 조회하기 위해 MMR값이 존재하는지 확인하는 과정에서 에러 발생");
            return -1;
        }

        return mmr;
    }
    /**
    * 랭킹 페이지에 보여주기 위해 유저 정보를 가져오는 메소드
    * */
    public RankDto.UserData getUserData(String userId)
    {
        Map<String, String> map = new HashMap<>();
        map.put("user_id", userId);
//        String url = "http://localhost:9000/user-service/getUserInfo";
        String url = "http://localhost:8080";
        RankDto.UserData userData = restTemplate.postForObject(url, map, RankDto.UserData.class);

        return RankDto.UserData.builder()
                .nickname(userData.getNickname())
                .stored_file_name(userData.getStored_file_name())
                .level(userData.getLevel())
                .speed_tier(userData.getSpeed_tier())
                .optimization_tier(userData.getOptimization_tier())
                .build();
    }

    /**
     * 유저의 승리 수, 패배 수, 승률을 구하기 위해 redis에 접근해 해당 정보를 가져오는 메소드
     * */
    public RankDto.WinLoseCount getWinLoseCount(String userId, String battleMode)
    {
        winLoseCount = redisTemplate.opsForHash();
        String key = "winloseCnt:" + userId + ":" + battleMode;
        long win = winLoseCount.get(key, "win");
        long lose = winLoseCount.get(key, "lose");
        long winningRate = win / (win + lose) * 100;

        return RankDto.WinLoseCount.builder()
                .win(win)
                .lose(lose)
                .winningRate(winningRate)
                .build();
    }

    /**
     * redis에 접근해 랭킹과 MMR 정보를 가져오는 메소드
     * */
    public RankDto.RankingAndMMR getRankingAndMMR(String userId, String battleMode)
    {
        System.out.println("GET RANKING AND MMR 들어왔음");
        System.out.println(userId + " " + battleMode);
        ranking = redisTemplate.opsForZSet();

        long grade = ranking.rank(battleMode, userId);
        System.out.println("등수: " + grade);
        int MMR = ranking.score(battleMode, userId).intValue();
        System.out.println("MMR: " + MMR);

        return RankDto.RankingAndMMR.builder()
                .grade(grade)
                .MMR(MMR)
                .build();
    }
}
