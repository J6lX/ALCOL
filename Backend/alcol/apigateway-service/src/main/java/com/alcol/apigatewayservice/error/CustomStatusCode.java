package com.alcol.apigatewayservice.error;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum CustomStatusCode
{
    NOT_ACCESS_TOKEN_IN_HEADER(
            HttpStatus.BAD_REQUEST,
            "100",
            "헤더에 access token 이 없습니다. 재 로그인 해주세요."
    ),
    NOT_REFRESH_TOKEN_IN_HEADER(
            HttpStatus.BAD_REQUEST,
            "101",
            "헤더에 refresh token 이 없습니다. 재 로그인 해주세요."
    ),
    ACCESS_TOKEN_EXPIRED(
            HttpStatus.UNAUTHORIZED,
            "102",
            "access token 이 만료되었습니다. refresh 요청을 해서 access token 을 재발급 받아주세요."
    ),
    REFRESH_TOKEN_EXPIRED(
            HttpStatus.UNAUTHORIZED,
            "103",
            "refresh token 이 만료되었습니다. 재 로그인 해주세요."
    ),
    BAD_ACCESS_TOKEN(
            HttpStatus.BAD_REQUEST,
            "104",
            "잘못된 access token 입니다. 재 로그인 해주세요."
    ),
    BAD_REFRESH_TOKEN(
            HttpStatus.BAD_REQUEST,
            "105",
            "잘못된 refresh token 입니다. 재 로그인 해주세요."
    );

    private final HttpStatus httpStatus;
    private final String customCode;
    private final String description;
}
