package com.alcol.problemservice.util;

import com.alcol.problemservice.dto.ScoreDto;
import com.alcol.problemservice.error.CustomStatusCode;

public class ApiUtils {
    public static <T> ScoreDto.ResponseDto<T> success(T bodyData, CustomStatusCode customStatusCode)
    {
        return ScoreDto.ResponseDto.<T>builder()
                .success(true)
                .bodyData(bodyData)
                .customCode(customStatusCode.getCustomCode())
                .description(customStatusCode.getDescription())
                .build();
    }

    public static ScoreDto.ResponseDto<?> error(CustomStatusCode customStatusCode)
    {
        return ScoreDto.ResponseDto.builder()
                .success(false)
                .bodyData(null)
                .customCode(customStatusCode.getCustomCode())
                .description(customStatusCode.getDescription())
                .build();
    }

}
