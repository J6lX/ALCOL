package com.alcol.problemservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

public class ScoreDto {

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request
    {
        private Long problem_id;
        private String language;
        private String code;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response
    {
        private String result;
        private int all_testcase_cnt;
        private int success_testcase_cnt;
        private int time;
        private int memory;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class getSubmissionErrorData
    {
        String error;
        ScoreDto.DataSubmissionId data;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DataSubmissionId
    {
        String submission_id;
    }


    @Getter
    @Builder
    @AllArgsConstructor
    public static class ResponseDto<T>
    {
        private final boolean success;
        private final T bodyData;
        private final String customCode;
        private final String description;
    }
}
