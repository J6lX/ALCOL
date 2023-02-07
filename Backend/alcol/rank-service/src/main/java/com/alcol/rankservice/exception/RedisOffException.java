package com.alcol.rankservice.exception;

import com.alcol.rankservice.dto.RedisOffDto;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j
@Component
public class RedisOffException extends HandlerInterceptorAdapter
{
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    @Autowired
    private RestTemplate restTemplate;
    private HashOperations<String, String, Long> winLoseCount;
    private ZSetOperations<String, Object> ranking;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
    {
        System.out.println("지금..........인터셉터로 들어왔어");
        if(redisTemplate.hasKey("dummy"))
        {
            log.info("redis 내려가지 않음");
            System.out.println("루루루라라라라라라라라라랄라 여기로 와야대ㅐㅐㅐㅐㅐㅐㅐ");
            return false;
        }
        else
        {
            log.warn("redis 내려감");

            winLoseCount = redisTemplate.opsForHash();
            ranking = redisTemplate.opsForZSet();

            // redis가 내려가면 데이터를 다시 log-service의 log table에서 긁어와서 넣어준다.
            String url = "http://localhost:9000/user-service/getWinLoseMMR";
            RedisOffDto[] informations = restTemplate.getForObject(url, RedisOffDto[].class);

            for(RedisOffDto info : informations)
            {
                // 스피드전에 대한 승패 결과 넣기
                winLoseCount.put("winloseCnt:" + info.getUserId() + ":speed", "win", (long)info.getSpeed_win());
                winLoseCount.put("winloseCnt:" + info.getUserId() + ":speed", "lose", (long)info.getSpeed_lose());

                // 최적화전에 대한 승패 결과 넣기
                winLoseCount.put("winloseCnt:" + info.getUserId() + ":optimization", "win", (long)info.getSpeed_win());
                winLoseCount.put("winloseCnt:" + info.getUserId() + ":optimization", "lose", (long)info.getSpeed_lose());

                // 유저별 mmr 넣기
                ranking.add("speed", info.getUserId(), info.getSpeed_mmr());
                ranking.add("optimization", info.getUserId(), info.getOptimization_mmr());
                return true;
            }

            return true;
        }
    }

}
