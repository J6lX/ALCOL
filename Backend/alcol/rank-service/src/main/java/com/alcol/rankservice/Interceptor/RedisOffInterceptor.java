package com.alcol.rankservice.Interceptor;

import com.alcol.rankservice.dto.RedisOffDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisOffInterceptor extends HandlerInterceptorAdapter
{

    private final RedisTemplate<String, Object> redisTemplate;
    private final RestTemplate restTemplate;
    private HashOperations<String, String, String> winLoseCount;
    private ZSetOperations<String, Object> ranking;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
    {
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
            String url = "http://localhost:9005/log-service/getAllResultAndMmr";
            List<RedisOffDto> informations = restTemplate.getForObject(url, List.class);

            for (int i = 0; i < informations.size(); i++)
            {
                RedisOffDto info = informations.get(i);
                // 스피드전에 대한 승패 결과 넣기
                winLoseCount.put("winloseCnt:" + info.getUserId() + ":speed", "win", String.valueOf(info.getSpeedWin()));
                winLoseCount.put("winloseCnt:" + info.getUserId() + ":speed", "lose", String.valueOf(info.getSpeedLose()));

                // 최적화전에 대한 승패 결과 넣기
                winLoseCount.put("winloseCnt:" + info.getUserId() + ":optimization", "win", String.valueOf(info.getOptimizationWin()));
                winLoseCount.put("winloseCnt:" + info.getUserId() + ":optimization", "lose", String.valueOf(info.getOptimizationLose()));

                // 유저별 mmr 넣기
                ranking.add("speed", info.getUserId(), info.getSpeedMmr());
                ranking.add("optimization", info.getUserId(), info.getOptimizationMmr());
            }

            ValueOperations<String, Object> valueOperations = redisTemplate.opsForValue();
            valueOperations.set("dummy", "dummy");
        }

        return true;
    }

}
