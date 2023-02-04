package com.alcol.userservice.service;

import com.alcol.userservice.dto.UserDto;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.multipart.MultipartFile;

import java.net.URISyntaxException;


public interface UserService extends UserDetailsService
{
    String createUser(UserDto.SignUpDto signUpDto, MultipartFile file) throws Exception;

    UserDto.UserDetailDto getUserDetailByEmail(String email);

    String getNewAccessToken(String userId);

    UserDto.UserInfoDto getUserInfo(String userId) throws URISyntaxException;

    UserDto.UserPlayDto getLevelAndTier(
            String curExp,
            String nowMmrBySpeed,
            String nowMmrByOptimization
    );

    void test() throws URISyntaxException;
}
