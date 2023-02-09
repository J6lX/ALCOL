package com.alcol.battleservice.util;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class Problem {
    int problemNum;
    String problemCategory;
}
