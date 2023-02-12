package com.alcol.problemservice.dto;

import com.alcol.problemservice.entity.ProblemCategoryConnectEntity;
import com.alcol.problemservice.entity.ProblemCategoryEntity;
import com.alcol.problemservice.entity.ProblemTierEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

public class ProblemDto
{
    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProbNameTierDto
    {
        private Long prob_no;
        private String prob_name;
        private String prob_tier;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProbDetail
    {
        private Long prob_no;
        private String prob_name;
        private String prob_content;
        private String prob_input_content;
        private String prob_output_content;
        private int prob_time_limit;
        private int prob_memory_limit;
        private String prob_input_testcase;
        private String prob_output_testcase;
        private String prob_tier;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProbList
    {
        private Long prob_no;
        private String prob_name;
        private List<String> prob_category;
        private String prob_tier;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ThreeProb
    {
        private Long prob_no;
        private List<String> prob_category;
    }
}
