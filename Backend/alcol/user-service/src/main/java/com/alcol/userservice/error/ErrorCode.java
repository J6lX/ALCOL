package com.alcol.userservice.error;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode
{
    DUPLICATE_USER_EMAIL(400, "001", "이메일이 중복된 경우"),
    DUPLICATE_USER_NICKNAME(400, "002", "닉네임이 중복된 경우");

    private final int status;
    private final String code;
    private final String description;
}
