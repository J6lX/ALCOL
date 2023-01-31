package com.alcol.rankservice;

import com.alcol.rankservice.config.RedisConfig;
import com.alcol.rankservice.dto.RecordDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RequiredArgsConstructor
@RestController
@RequestMapping("/BattleResult")
public class RedisTest
{

    private final RedisTemplate<String, RecordDto> redisTemplate;
        public String example(){
            HashOperations<String, String, String>hash = redisTemplate.opsForHash();
            ValueOperations<String,> // 하는중
            hash.put("seo", "win", "100");
            hash.put("seo","lose","12");
            int win = Integer.parseInt(hash.get("seo", "win")) + 1;

            hash.put("seo", "win", String.valueOf(win));

            return "ok";
        }
}
