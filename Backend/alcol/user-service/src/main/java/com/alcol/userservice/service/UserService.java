package com.alcol.userservice.service;

import com.alcol.userservice.dto.UserDto;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.multipart.MultipartFile;


public interface UserService extends UserDetailsService
{
    String createUser(UserDto.SignUpDto signUpDto, MultipartFile file) throws Exception;

    UserDto.UserDetailDto getUserDetailByEmail(String email);

    String getNewAccessToken(String userId);
}
