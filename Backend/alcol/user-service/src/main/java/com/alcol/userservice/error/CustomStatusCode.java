package com.alcol.userservice.error;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum CustomStatusCode
{
    CREATE_USER_SUCCESS(HttpStatus.CREATED, "000", "회원가입에 성공하였습니다."),
    LOGIN_SUCCESS(HttpStatus.OK, "001", "로그인에 성공하였습니다."),
    CREATE_NEW_ACCESS_TOKEN(HttpStatus.CREATED, "002", "새로운 access token 이 발급되었습니다."),
    DUPLICATE_USER_EMAIL(HttpStatus.CONFLICT, "003", "회원가입 실패. 이메일이 중복되었습니다."),
    DUPLICATE_USER_NICKNAME(HttpStatus.CONFLICT, "004", "회원가입 실패. 닉네임이 중복되었습니다."),
    PICTURE_UPLOAD_FAILURE(HttpStatus.CONFLICT, "005", "회원가입 실패. 사진 저장에 실패하였습니다."),
    LOGIN_FAILURE(HttpStatus.CONFLICT, "006", "로그인 실패. 이메일 또는 비밀번호가 틀렸습니다. " +
            "재 로그인 해주세요."),
    UPDATE_USER_SUCCESS(HttpStatus.CREATED, "007", "회원 정보 수정에 성공하였습니다.");

    private final HttpStatus httpStatus;
    private final String customCode;
    private final String description;
}
