package com.alcol.rankservice.Interceptor;

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
import java.util.List;
import java.util.Map;

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
        if(!redisTemplate.hasKey("dummy"))
        {
            log.warn("redis 내려감");

            winLoseCount = redisTemplate.opsForHash();
            ranking = redisTemplate.opsForZSet();

            // redis 가 내려가면 데이터를 다시 log-service 의 log table 에서 긁어와서 넣어준다.
            String url = "http://i8b303.p.ssafy.io:8000/log-service/getAllResultAndMmr";
            List<Map<String, String>> informations = restTemplate.getForObject(url, List.class);

            for (int i = 0; i < informations.size(); i++)
            {
                Map<String, String> info = informations.get(i);

                String userId = info.get("userId");
                String speedMmr = String.valueOf(info.get("speedMmr"));
                String speedWin = String.valueOf(info.get("speedWin"));
                String speedLose = String.valueOf(info.get("speedLose"));
                String optimizationMmr = String.valueOf(info.get("optimizationMmr"));
                String optimizationWin = String.valueOf(info.get("optimizationWin"));
                String optimizationLose = String.valueOf(info.get("optimizationLose"));

                // 스피드전에 대한 승패 결과 넣기
                winLoseCount.put("winloseCnt:" + userId + ":speed", "win", speedWin);
                winLoseCount.put("winloseCnt:" + userId + ":speed", "lose", speedLose);

                // 최적화전에 대한 승패 결과 넣기
                winLoseCount.put("winloseCnt:" + userId + ":optimization", "win", optimizationWin);
                winLoseCount.put("winloseCnt:" + userId + ":optimization", "lose", optimizationLose);

                // 유저별 mmr 넣기
                ranking.add("speed", userId, Double.parseDouble(speedMmr));
                ranking.add("optimization", userId, Double.parseDouble(optimizationMmr));
            }

            ValueOperations<String, Object> valueOperations = redisTemplate.opsForValue();
            valueOperations.set("dummy", "dummy");
        }

        return true;
    }

}
