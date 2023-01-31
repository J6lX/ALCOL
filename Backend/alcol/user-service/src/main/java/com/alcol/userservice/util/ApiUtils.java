package com.alcol.userservice.util;

import com.alcol.userservice.dto.UserDto;
import com.alcol.userservice.error.CustomStatusCode;

public class ApiUtils
{
    public static <T>UserDto.ResponseDto<T> success(T bodyData, CustomStatusCode customStatusCode)
    {
        return UserDto.ResponseDto.<T>builder()
                .success(true)
                .bodyData(bodyData)
                .customCode(customStatusCode.getCustomCode())
                .description(customStatusCode.getDescription())
                .build();
    }

    public static UserDto.ResponseDto<?> error(CustomStatusCode customStatusCode)
    {
        return UserDto.ResponseDto.builder()
                .success(false)
                .bodyData(null)
                .customCode(customStatusCode.getCustomCode())
                .description(customStatusCode.getDescription())
                .build();
    }
}
