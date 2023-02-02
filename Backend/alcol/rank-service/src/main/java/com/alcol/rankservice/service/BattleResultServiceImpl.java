package com.alcol.rankservice.service;

import com.alcol.rankservice.entity.WinLose;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BattleResultServiceImpl implements BattleResultService
{
    @Autowired
    private final RedisTemplate<String, Object> redisTemplate;
    private HashOperations<String, String, Long> winLoseCount;
    private HashOperations<String, String, String> userInfo;
    private ZSetOperations<String, Object> ranking;

    /**
     * @implSpec 배틀이 끝난 뒤 log service에서 정보를 받아 승패count, 랭킹 집계에 사용하기 위해 redis에 저장하는 메서드
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
     * @implSpec 랭킹집계 value에 필요한 데이터를 user service에 요청하는 메서드
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
}
