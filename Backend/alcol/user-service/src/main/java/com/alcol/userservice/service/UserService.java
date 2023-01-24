package com.alcol.userservice.service;

import com.alcol.userservice.dto.SignUpDto;

public interface UserService {
    String createUser(SignUpDto signUpDto);
}
