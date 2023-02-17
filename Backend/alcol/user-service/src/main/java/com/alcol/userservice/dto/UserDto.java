package com.alcol.userservice.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.*;

import java.time.LocalDateTime;

public class UserDto
{
    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDetailDto
    {
        private String userId;
        private String email;
        private String nickname;
        private String image;
        private LocalDateTime createdAt;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    public static class UserInfoDto
    {
        private String nickname;
        private int level;
        private String speedTier;
        private String optimizationTier;
        private String storedFileName;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserPlayDto
    {
        private int exp;
        private int speedMmr;
        private int optimizationMmr;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SignUpDto
    {
        private String email;
        private String pwd;
        private String nickname;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserUpdateDto
    {
        private String userId;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginDto
    {
        private String email;
        private String pwd;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    public static class UserBattleLogDto
    {
        private int battleResult;
        private String battleMode;
        private String otherUserId;
        private String otherUserNickname;
        private Long probNo;
        private String probName;
        private String probTier;
        private LocalDateTime endTime;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    @JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
    public static class ResponseDto<T>
    {
        private final boolean success;
        private final T bodyData;
        private final String customCode;
        private final String description;
    }
}
