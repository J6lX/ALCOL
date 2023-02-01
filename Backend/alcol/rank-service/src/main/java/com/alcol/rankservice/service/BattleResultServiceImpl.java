package com.alcol.rankservice.service;

import com.alcol.rankservice.dto.BattleDto;
import com.alcol.rankservice.entity.WinLoseCnt;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
@RequiredArgsConstructor
public class BattleResultServiceImpl implements BattleResultService
{
    private final RedisTemplate<String, Object> redisTemplate;
    private HashOperations<String, String, String> hash;

    public String recordResult(BattleDto.Request battleResult)
    {
        hash = redisTemplate.opsForHash();
        // key는 winloseCnt:{userId}:{mode}
        hash.put("winloseCnt:"+battleResult.getUser_id_1()+":"+battleResult.getBattle_mode(), "win", "100");
//        hash.put("seo","lose","12");
//        int win = Integer.parseInt(hash.get("seo", "win")) + 1;

//        hash.put("seo", "win", String.valueOf(win));
        return "OKOK";
    }

    public BattleDto.Response saveResult(BattleDto battleResult){
        WinLoseCnt user1 = WinLoseCnt.builder()
                .userId(battleResult.getUser_id_1())
                .mode(battleResult.getBattle_mode())
                .winLose(battleResult.getWin_1())
                .build();
        WinLoseCnt user2 = WinLoseCnt.builder()
                .userId(battleResult.getUser_id_2())
                .mode(battleResult.getBattle_mode())
                .winLose(battleResult.getWin_2())
                .build();
    }

}
