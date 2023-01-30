package com.alcol.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ErrorDto
{
    private final String code;
    private final String message;
}
