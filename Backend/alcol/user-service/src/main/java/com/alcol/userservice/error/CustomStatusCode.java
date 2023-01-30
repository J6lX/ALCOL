package com.alcol.userservice.error;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum CustomStatusCode
{
    CREATE_USER_SUCCESS(HttpStatus.CREATED, "000", "회원가입에 성공하였습니다."),
    DUPLICATE_USER_EMAIL(HttpStatus.CONFLICT, "001", "이메일이 중복되었습니다."),
    DUPLICATE_USER_NICKNAME(HttpStatus.CONFLICT, "002", "닉네임이 중복되었습니다."),
    CREATE_NEW_ACCESS_TOKEN(HttpStatus.CREATED, "003", "새로운 access token 이 발급되었습니다.");

    private final HttpStatus httpStatus;
    private final String customCode;
    private final String description;
}
