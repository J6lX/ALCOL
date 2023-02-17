package com.alcol.battleservice.util;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
@ToString
public class Problem {
    int problemNum;
    List<String> problemCategory = new ArrayList<>();
}
