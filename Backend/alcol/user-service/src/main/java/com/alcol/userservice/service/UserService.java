package com.alcol.userservice.service;

import com.alcol.userservice.dto.SignUpDto;
import com.alcol.userservice.dto.UserDto;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService
{
    String createUser(SignUpDto signUpDto);

    UserDto getUserDetailByEmail(String email);

    String getNewAccessToken(String userId);
}
