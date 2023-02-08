package com.alcol.battleservice.util;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class BattleRoom {
    User user1;
    User user2;
}
