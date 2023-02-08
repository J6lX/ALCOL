package com.alcol.rankservice.exception;

import com.alcol.rankservice.dto.RedisOffDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisOffException extends HandlerInterceptorAdapter
{

    private final RedisTemplate<String, Object> redisTemplate;
    private final RestTemplate restTemplate;
    private HashOperations<String, String, String> winLoseCount;
    private ZSetOperations<String, Object> ranking;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
    {
        System.out.println("지금..........인터셉터로 들어왔어");

//        try{
//            redisTemplate.hasKey("dummy");
//            System.out.println("더미 파일 있음");
//        } catch (NullPointerException e){
//            log.warn("redis 내려감");
//
//            winLoseCount = redisTemplate.opsForHash();
//            ranking = redisTemplate.opsForZSet();
//
//            // redis가 내려가면 데이터를 다시 log-service의 log table에서 긁어와서 넣어준다.
//            String url = "http://localhost:9000/user-service/getWinLoseMMR";
//            RedisOffDto[] informations = restTemplate.getForObject(url, RedisOffDto[].class);
//
//            for(RedisOffDto info : informations)
//            {
//                // 스피드전에 대한 승패 결과 넣기
//                winLoseCount.put("winloseCnt:" + info.getUserId() + ":speed", "win", String.valueOf(info.getSpeed_win()));
//                winLoseCount.put("winloseCnt:" + info.getUserId() + ":speed", "lose", String.valueOf(info.getSpeed_lose()));
//
//                // 최적화전에 대한 승패 결과 넣기
//                winLoseCount.put("winloseCnt:" + info.getUserId() + ":optimization", "win", String.valueOf(info.getSpeed_win()));
//                winLoseCount.put("winloseCnt:" + info.getUserId() + ":optimization", "lose", String.valueOf(info.getSpeed_lose()));
//
//                // 유저별 mmr 넣기
//                ranking.add("speed", info.getUserId(), info.getSpeed_mmr());
//                ranking.add("optimization", info.getUserId(), info.getOptimization_mmr());
//                return true;
//            }
//        }
        if(redisTemplate.hasKey("dummy"))
        {
            log.info("redis 내려가지 않음");
            System.out.println("더미가 있어 더미가 더미더미");
        }
        else
        {
            log.warn("redis 내려감");

            winLoseCount = redisTemplate.opsForHash();
            ranking = redisTemplate.opsForZSet();

            // redis가 내려가면 데이터를 다시 log-service의 log table에서 긁어와서 넣어준다.
//            String url = "http://localhost:9000/user-service/getWinLoseMMR";
            String url = "http://localhost:8080/whenRedisDown";
            RedisOffDto[] informations = restTemplate.getForObject(url, RedisOffDto[].class);

            for(RedisOffDto info : informations)
            {
                // 스피드전에 대한 승패 결과 넣기
                winLoseCount.put("winloseCnt:" + info.getUserId() + ":speed", "win", String.valueOf(info.getSpeed_win()));
                winLoseCount.put("winloseCnt:" + info.getUserId() + ":speed", "lose", String.valueOf(info.getSpeed_lose()));

                // 최적화전에 대한 승패 결과 넣기
                winLoseCount.put("winloseCnt:" + info.getUserId() + ":optimization", "win", String.valueOf(info.getSpeed_win()));
                winLoseCount.put("winloseCnt:" + info.getUserId() + ":optimization", "lose", String.valueOf(info.getSpeed_lose()));

                // 유저별 mmr 넣기
                ranking.add("speed", info.getUserId(), info.getSpeed_mmr());
                ranking.add("optimization", info.getUserId(), info.getOptimization_mmr());
            }
        }
        return true;
    }

}
