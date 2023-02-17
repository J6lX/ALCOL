package com.alcol.battleservice.util;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import javax.websocket.Session;
import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
@ToString
public class User {
    Session session;
    String userId;
    String battleResult;
    int prevMmr;
    int nowMmr;
    String battleMode;
    String battleTime;
    int banProblemNum;
    List<BattleLog> battleLog = new ArrayList<>();

    int accept_time=-1;
    int accept_memory=-1;

}
