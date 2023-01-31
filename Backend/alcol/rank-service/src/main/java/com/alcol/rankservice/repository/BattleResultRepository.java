package com.alcol.rankservice.repository;

import com.alcol.rankservice.dto.RecordDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;

import javax.annotation.Resource;

@Repository
@RequiredArgsConstructor
public class BattleResultRepository
{
    private final RedisTemplate<String, RecordDto> redisTemplate;

//    @Resource(name = "redisTemplate")
    private HashOperations<String, String, String> hashOpsWinLoseCnt;

    public String example(){
//        HashOperations<String, String, RecordDto> hash = redisTemplate.opsForHash();
        ValueOperations<String, RecordDto> valueOperations = redisTemplate.opsForValue();
        valueOperations.set("seo", new RecordDto(92,14));
        System.out.println(valueOperations.get("seo"));
//        hash.put("seo", "win", "100");
//        hash.put("seo","lose","12");
//        int win = Integer.parseInt(hash.get("seo", "win")) + 1;

//        hash.put("seo", "win", String.valueOf(win));


        return "ok";
    }
}
