package com.alcol.rankservice;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;


@RequiredArgsConstructor
//@RestController
//@RequestMapping("/BattleResult")
public class RedisTest
{

    private final RedisTemplate<String, Object> redisTemplate;
    private HashOperations<String, String, String> hash;

//    @GetMapping("/here")
        public String example(){
//            hash = redisTemplate.opsForHash();
            // key는 winloseCnt:{userId}:{mode}
            hash.put("seo", "win", "100");
            hash.put("seo","lose","12");
            int win = Integer.parseInt(hash.get("seo", "win")) + 1;

            hash.put("seo", "win", String.valueOf(win));

            return "ok";
        }
}
