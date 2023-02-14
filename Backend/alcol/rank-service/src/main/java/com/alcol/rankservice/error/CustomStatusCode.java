package com.alcol.rankservice.error;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum CustomStatusCode
{
    BATTLE_RECORD_EXIST(HttpStatus.OK, "000", "해당 유저의 배틀 전적이 존재합니다."),
    BATTLE_RECORD_NOT_EXIST(HttpStatus.CONFLICT, "001", "해당 유저의 배틀 전적이 존재하지 않습니다."),
    ALL_USER_BATTLE_RANKING_EXIST(HttpStatus.OK, "002", "해당 모드의 랭킹 정보가 존재합니다."),
    ALL_USER_BATTLE_RANKING_NOT_EXIST(HttpStatus.CONFLICT, "003", "해당 모드의 랭킹 정보가 없습니다."),
    SEARCH_USER_EXIST(HttpStatus.OK, "004", "검색한 유저가 존재합니다."),
    SEARCH_USER_NOT_EXIST(HttpStatus.CONFLICT, "005", "검색한 유저가 존재하지 않습니다"),
    SEARCH_TOP3_EXIST(HttpStatus.OK, "006", "모드별 TOP3가 존재합니다."),
    SEARCH_TOP3_NOT_EXIST(HttpStatus.CONFLICT, "007", "모드별 TOP3가 존재하지 않습니다.");



    private final HttpStatus httpStatus;
    private final String customCode;
    private final String description;
}

