package com.alcol.apigatewayservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ResponseDto<T>
{
    private final boolean success;
    private final T bodyData;
    private final String customCode;
    private final String description;
}
