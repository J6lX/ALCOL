package com.alcol.problemservice.error;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum CustomStatusCode
{

    SCORE_SUCCESS(HttpStatus.OK, "100", "채점이 완료되었습니다."),
    SCORE_SUBMISSION_ERROR(HttpStatus.CONFLICT, "101", "제출 아이디를 가져오는 곳에서 오류가 발생하였습니다."),
    SCORE_RESULT_ERROR(HttpStatus.CONFLICT, "102", "제출 결과를 가져오는 것에서 오류가 발생하였습니다."),
    SCORE_COMPILE_ERROR(HttpStatus.CONFLICT, "103", "컴파일 에러가 발생하였습니다."),
    SCORE_CODE_ISEMPTY(HttpStatus.CONFLICT, "104", "빈 코드입니다.");


    private final HttpStatus httpStatus;
    private final String customCode;
    private final String description;
}

