package com.alcol.problemservice.dto;

import com.alcol.problemservice.entity.ProblemTierEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class ProblemDto
{
    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProbDetailDto
    {
        private Long probNo;
        private String probName;
        private ProblemTierEntity probTier;
    }
}
