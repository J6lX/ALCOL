package com.alcol.matchservice.controller;

import com.alcol.matchservice.util.WebSocket;
import com.netflix.discovery.converters.Auto;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("")
//@AllArgsConstructor
public class MatchController {

    @Autowired
    WebSocket webSocket;
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    private HashOperations<String, String, Long> hi;
    private ZSetOperations<String, Object> ranking;

//    public MatchController(RedisTemplate<String, Object> redisTemplate)
//    {
//        this.redisTemplate = redisTemplate;
//    }

    @GetMapping("/")
    public void RedisTest(){
        hi = redisTemplate.opsForHash();
        ranking = redisTemplate.opsForZSet();
//        System.out.println(hi.get("winloseCnt:userId1:speed", "win"));
        System.out.println(ranking.score("speed", "userId1").toString());
    }
}
