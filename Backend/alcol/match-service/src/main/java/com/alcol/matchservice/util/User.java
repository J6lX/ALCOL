package com.alcol.matchservice.util;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class User {
    String id;
    String name;
    String mode;
    String language;
    int mmr;
}
