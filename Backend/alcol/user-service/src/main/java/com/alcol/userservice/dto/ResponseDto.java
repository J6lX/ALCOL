package com.alcol.userservice.dto;

import lombok.Getter;


@Getter
public class ResponseDto<T>
{
    private final boolean success;
    private final T bodyData;
    private final String customCode;
    private final String description;

    public ResponseDto(boolean success, T bodyData, String customCode, String description)
    {
        this.success = success;
        this.bodyData = bodyData;
        this.customCode = customCode;
        this.description = description;
    }

//    private final String customCode;
//    private final String description;

//    public static ResponseEntity<ResponseDto> toResponseEntity(CustomStatusCode customStatusCode)
//    {
//        return ResponseEntity
//                .status(customStatusCode.getHttpStatus())
//                .body(ResponseDto.builder()
//                        .customCode(customStatusCode.getCustomCode())
//                        .description(customStatusCode.getDescription())
//                        .build()
//                );
//    }
}
