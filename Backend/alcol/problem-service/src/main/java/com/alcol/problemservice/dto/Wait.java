package com.alcol.problemservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class Wait {
    int problem_no;
    List<String> problem_category;
}
