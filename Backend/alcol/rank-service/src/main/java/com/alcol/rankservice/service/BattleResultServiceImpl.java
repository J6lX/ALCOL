package com.alcol.rankservice.service;

import com.alcol.rankservice.entity.Rank;
import com.alcol.rankservice.entity.UserData;
import com.alcol.rankservice.entity.WinLose;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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
public class BattleResultServiceImpl implements BattleResultService
{
    @Autowired
    private final RedisTemplate<String, Object> redisTemplate;
    private HashOperations<String, String, Long> winLoseCount;
    private HashOperations<String, String, String> userInfo;
    private ZSetOperations<String, Object> ranking;
    private final RestTemplate restTemplate;

    /**
     * @implSpec 배틀이 끝난 뒤 log service에서 정보를 받아 승패count, 랭킹 집계에 사용하기 위해 redis에 저장하는 메서드
     * Hash 사용
     * */
    public String recordCnt(WinLose winLose)
    {
        winLoseCount = redisTemplate.opsForHash();
        /** key = winloseCnt:{userId}:{mode}
            hashKey = win or lose
            value = win 수 or lose 수*/
        String key = "winloseCnt:"+winLose.getUserId()+":"+winLose.getMode();
        String hashKey = winLose.getWinLoseResult() == 1 ? "win" : "lose";
        long hashValue = -1;

        // redis에 해당 유저의 승패 관련 데이터가 없었다면
        if(winLoseCount.get(key, hashKey) == null)
        {
            // 승패에 관한 데이터를 0으로 넣어준다.
            winLoseCount.put(key, "win", (long)0);
            winLoseCount.put(key, "lose", (long)0);
        }
        hashValue = winLoseCount.get(key, hashKey) + 1;
        winLoseCount.put(key, hashKey, hashValue);

        return "OK";
    }

    /**
     * @implSpec 배틀이 끝난 뒤 redis에 유저별 랭킹 기록하는 메서드
     * Sorted set 사용
     * */
    public String recordRank(String mode, int mmr, String userId)
    {
        ranking = redisTemplate.opsForZSet();
        /** key = speed/optimization, member = userId, score = mmr */
        String zKey = mode;
        String zMember = userId;
        int zScore = mmr;
        ranking.add(zKey, zMember, zScore);

        return "OK";
    }
    /**
     * @implSpec 배틀이 끝난 뒤 redis에 랭킹에 필요한 사용자 데이터 저장하는 메서드
     * Hash 사용
     * */
    public String recordUserData(String userId){

        userInfo = redisTemplate.opsForHash();
        String key = "userInfo:" + userId;

        Map<String, String> map = new HashMap<>();
        map.put("user_id", userId);
//        String url = "http://localhost:9000/user-service/getUserInfo";
        String url = "http://localhost:8080";
        UserData userData = restTemplate.postForObject(url, map, UserData.class);

        userInfo.put(key, "nickname", userData.getNickname());
        userInfo.put(key, "stored_file_name", userData.getStored_file_name());
        userInfo.put(key, "level", String.valueOf(userData.getLevel()));
        userInfo.put(key, "speed_tier", userData.getSpeed_tier());
        userInfo.put(key, "optimization_tier", userData.getOptimization_tier());

        return "OKDK";
    }
    /**
     * @implSpec 스피드전 개인 랭킹 가져오기
     */
    public int getMySpeedRank(String userId, String mode)
    {
        // 1. 해당 userId가 redis에 있는 ranking에 MMR 값이 존재하는지 확인
        ranking = redisTemplate.opsForZSet();
        String key = mode;
        String member = userId;
        int mmr = -1;

        try {
            mmr = ranking.score(key, member).intValue();
        } catch(NullPointerException e){
            log.error("mmr값이 존재하지 않음!!!!!!!!");
            return -1;
        } catch (Exception e){
            log.error("개인 스피드전 랭킹을 조회하기 위해 MMR값이 존재하는지 확인하는 과정에서 에러 발생");
            return -1;
        }

        return mmr;
    }

}
