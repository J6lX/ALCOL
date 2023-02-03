package com.alcol.rankservice.service;

import com.alcol.rankservice.entity.Rank;
import com.alcol.rankservice.entity.WinLose;
import lombok.RequiredArgsConstructor;
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
public class BattleResultServiceImpl implements BattleResultService
{
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

        // 승패 여부에 따라 count+=1
        hashValue = winLoseCount.get(key, hashKey) + 1;
        // redis update
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
        
        // redis ranking data update
        ranking.add(zKey, zMember, zScore);

//        ranking.add("speed", "1", 1200);
//        ranking.add("speed", "2", 1280);
//        ranking.add("speed", "3", 1170);
//        ranking.add("speed", "4", 1250);
//        ranking.add("optimization", "1", 1200);
//        ranking.add("optimization", "2", 1280);
//        ranking.add("optimization", "3", 1170);
//        ranking.add("optimization", "4", 1250);

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
        String url = "http://localhost:8000/user-service/getUserInfo";
//        String url = "http://localhost:8080";

        // 랭킹 데이터를 보여줄 때 필요한 유저정보를 user Service에 요청해 받아옴
        Rank.ReceivedUserData userData = restTemplate.postForObject(url, map, Rank.ReceivedUserData.class);

        // 유저 정보 redis update
        userInfo.put(key, "nickname", userData.getNickname());
        userInfo.put(key, "stored_file_name", userData.getStored_file_name());
        userInfo.put(key, "level", String.valueOf(userData.getLevel()));
        userInfo.put(key, "speed_tier", userData.getSpeed_tier());
        userInfo.put(key, "optimization_tier", userData.getOptimization_tier());

        return "OKDK";
    }

}
