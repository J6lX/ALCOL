package com.alcol.userservice.dto;

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
    public static class UserInfoDto
    {
        private String nickname;
        private String level;
        private String speedTier;
        private String optimizationTier;
        private String storedFileName;
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
    public static class LoginDto
    {
        private String email;
        private String pwd;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class ResponseDto<T>
    {
        private final boolean success;
        private final T bodyData;
        private final String customCode;
        private final String description;
    }
}
