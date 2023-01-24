package com.alcol.userservice.service;

import com.alcol.userservice.dto.SignUpDto;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService
{
    String createUser(SignUpDto signUpDto);
}
