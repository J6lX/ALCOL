package com.alcol.rankservice.service;

import com.alcol.rankservice.dto.BattleDto;
import com.alcol.rankservice.entity.Rank;
import com.alcol.rankservice.entity.WinLose;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BattleResultServiceImpl implements BattleResultService
{
    private final RedisTemplate<String, Object> redisTemplate;
    private HashOperations<String, String, Long> winLoseCount;
    private ZSetOperations<String, Object> ranking;

    /**
     * @implSpec 배틀이 끝난 뒤 log service에서 정보를 받아 승패count, 랭킹 집계에 사용하기 위해 redis에 저장하는 메서드
     * */
    public BattleDto.Response recordResult(WinLose winLose)
    {
        winLoseCount = redisTemplate.opsForHash();
        // key = winloseCnt:{userId}:{mode}
        String key = "winloseCnt:"+winLose.getUserId()+":"+winLose.getMode();
        String hashKey = winLose.getWinLose() == 1 ? "win" : "lose";
        long hashValue = 1;
        if(winLoseCount.get(key, hashKey) != null)
        {
            hashValue = winLoseCount.get(key, hashKey) + 1;
        }
        System.out.println(hashValue);
        winLoseCount.put(key, hashKey, hashValue);

        return BattleDto.Response.builder()
                .returnMsg("OK")
                .build();
    }
    /**
     * @implSpec 랭킹집계 value에 필요한 데이터를 user service에 요청하는 메서드
     * Sorted set 사용
     * */
    public String recordRank(Rank.ReceivedUserData user, String mode, int mmr)
    {
        ranking = redisTemplate.opsForZSet();
        String key = "winloseCnt:" + ":" + mode;
        long win = winLoseCount.get(key, 1);
        long lose = winLoseCount.get(key, 10);
        long winningRate = win / (win+lose);

        // key = speend/optimization, member = userId, score = mmr
        Rank.RankingData userInfo = Rank.RankingData.builder()
                .nickname(user.getNickname())
                .profile_pic(user.getProfile_pic())
                .level(user.getLevel())
                .tier(user.getTier())
                .mmr(mmr)
                .winningRate(winningRate)
                .build();
        ranking.add("keyyy", userInfo, 2);
        return "OK";
    }
}
