package com.alcol.logservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class LogDto
{
    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserPlayDto
    {
        private String level;
        private String speedTier;
        private String optimizationTier;
    }
}
