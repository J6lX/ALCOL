package com.alcol.userservice.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDto
{
    private String userId;
    private String email;
    private String nickname;
    private String image;
    private LocalDateTime createdAt;
}
