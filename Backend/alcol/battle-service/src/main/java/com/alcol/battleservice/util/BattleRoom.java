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
    HashMap<Integer, Boolean> problemList = new HashMap<>();
    int problemNum;
    List<Problem> problems = new ArrayList<>();
}
