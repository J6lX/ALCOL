package com.alcol.rankservice.Entity;

import lombok.Getter;
import org.springframework.data.redis.core.RedisHash;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Getter
@RedisHash(value = "winloseCnt")
public class WinLoseCnt
{
    @Id
    private String id;
    private int win;
    private int lose;

}
