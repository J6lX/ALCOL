package com.alcol.rankservice.service;

import com.alcol.rankservice.dto.RankDto;
import com.alcol.rankservice.dto.WinLoseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class BattleResultServiceImpl implements BattleResultService
{
    private final RedisTemplate<String, Object> redisTemplate;
    private HashOperations<String, String, String> winLoseCount;
    private HashOperations<String, String, String> userInfo;
    private ZSetOperations<String, Object> ranking;
    private final RestTemplate restTemplate;

    /**
     * 배틀이 끝난 뒤 log service에서 정보를 받아 승패 count, 랭킹 집계에 사용하기 위해 redis에 저장하는 메서드
     * Hash 사용
     *
     * key = winloseCnt:{userId}:{mode}
     *             hashKey = win / lose
     *             value = win 수 / lose 수
     * */
    public boolean recordCnt(WinLoseDto winLose)
    {
        winLoseCount = redisTemplate.opsForHash();
        try {
            String key = "winloseCnt:" + winLose.getUserId() + ":" + winLose.getMode();
            String hashKey = winLose.getWinLoseResult() == 1 ? "win" : "lose";
            long hashValue = -1;

            // redis에 해당 유저의 승패 관련 데이터가 없었다면
            if (winLoseCount.get(key, hashKey) == null) {
                // 승패에 관한 데이터를 0으로 넣어준다.
                winLoseCount.put(key, "win", "0");
                winLoseCount.put(key, "lose", "0");
            }

            // 승패 여부에 따라 count+=1
            hashValue = Integer.valueOf(winLoseCount.get(key, hashKey)) + 1;
            // redis update
            winLoseCount.put(key, hashKey, String.valueOf(hashValue));
        }
        catch (Exception e)
        {
            log.error("유저의 승패수를 업데이트하는 과정에서 에러 발생!");
            return false;
        }

        return true;
    }

    /**
     * 배틀이 끝난 뒤 redis에 유저별 랭킹 기록하는 메서드
     * Sorted set 사용
     * */
    public boolean recordRank(String mode, int mmr, String userId)
    {
        ranking = redisTemplate.opsForZSet();
        /** key = speed/optimization, member = userId, score = mmr */
        String zKey = mode;
        String zMember = userId;
        int zScore = mmr;

        try
        {
            // redis ranking data update
            ranking.add(zKey, zMember, zScore);
        }
        catch (Exception e)
        {
            log.error("사용자별 랭킹을 업데이트하는 과정에서 오류 발생!");
            return false;
        }

        return true;
    }

    /**
     * 배틀이 끝난 뒤 redis에 랭킹에 필요한 사용자 데이터 저장하는 메서드
     * Hash 사용
     * */
    public boolean recordUserData(String userId)
    {
        userInfo = redisTemplate.opsForHash();
        String key = "userInfo:" + userId;

        Map<String, String> map = new HashMap<>();
        map.put("user_id", userId);
        String url = "http://i8b303.p.ssafy.io:8000/user-service/getUserInfo";
        RankDto.UserData userData = null;
        try
        {
            userData = restTemplate.postForObject(url, map, RankDto.UserData.class);
        }
        catch (Exception e)
        {
            log.error("유저 데이터를 user-service에서 받아오는 과정에서 오류 발생!");
            return false;
        }

        try {
            // 유저 정보 redis update
            userInfo.put(key, "nickname", userData.getNickname());
            userInfo.put(key, "stored_file_name", userData.getStoredFileName());
            userInfo.put(key, "level", String.valueOf(userData.getLevel()));
            userInfo.put(key, "speed_tier", userData.getSpeedTier());
            userInfo.put(key, "optimization_tier", userData.getOptimizationTier());
        }
        catch (Exception e)
        {
            log.error("유저 정보를 redis에 저장하는 과정에서 에러 발생!");
            return false;
        }

        log.info("닉네임이 " + userData.getNickname() + "인 회원에 대한 정보를 redis에 저장하였습니다.");
        return true;
    }

}
