package com.alcol.battleservice.util;

import com.sun.org.apache.xpath.internal.operations.Bool;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Getter
@Builder
@ToString
public class BattleRoom {
    User user1;
    User user2;
    HashMap<Integer, Boolean> problemBanCheck = new HashMap<>();
    int problemNum;
    List<Problem> problemList = new ArrayList<>();

    int time_limit = 0;
    int memory_limit = 0;
    int timeOutCnt = 0;
}
