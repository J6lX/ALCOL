package com.alcol.userservice.dto;

import lombok.Data;

@Data
public class SignUpDto
{
    private String email;
    private String pwd;
    private String nickname;
}
