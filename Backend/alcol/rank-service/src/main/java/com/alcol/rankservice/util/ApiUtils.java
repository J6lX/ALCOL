package com.alcol.rankservice.util;

import com.alcol.rankservice.dto.RankDto;
import com.alcol.rankservice.error.CustomStatusCode;

public class ApiUtils {
    public static <T>RankDto.ResponseDto<T> success(T bodyData, CustomStatusCode customStatusCode)
    {
        return RankDto.ResponseDto.<T>builder()
                .success(true)
                .bodyData(bodyData)
                .customCode(customStatusCode.getCustomCode())
                .description(customStatusCode.getDescription())
                .build();
    }

    public static RankDto.ResponseDto<?> error(CustomStatusCode customStatusCode)
    {
        return RankDto.ResponseDto.builder()
                .success(false)
                .bodyData(null)
                .customCode(customStatusCode.getCustomCode())
                .description(customStatusCode.getDescription())
                .build();
    }

}
