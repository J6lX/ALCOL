package com.alcol.rankservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RankServiceImpl {
    private final RedisTemplate<String, Object> redisTemplate;
    private ZSetOperations<String, Object> ranking;


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
            log.debug("mmr값이 존재하지 않음!!!!!!!!");
            return -1;
        } catch (Exception e){
            log.error("개인 스피드전 랭킹을 조회하기 위해 MMR값이 존재하는지 확인하는 과정에서 에러 발생");
            return -1;
        }

        return mmr;
    }
}
