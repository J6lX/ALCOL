package com.alcol.userservice.util;

import com.alcol.userservice.dto.ResponseDto;
import com.alcol.userservice.error.CustomStatusCode;

public class ApiUtils
{
    public static <T>ResponseDto<T> success(T bodyData, CustomStatusCode customStatusCode)
    {
        return new ResponseDto<>(
                true,
                bodyData,
                customStatusCode.getCustomCode(),
                customStatusCode.getDescription()
        );
    }

    public static ResponseDto<?> error(CustomStatusCode customStatusCode)
    {
        return new ResponseDto<>(
                false,
                null,
                customStatusCode.getCustomCode(),
                customStatusCode.getDescription()
        );
    }
}
