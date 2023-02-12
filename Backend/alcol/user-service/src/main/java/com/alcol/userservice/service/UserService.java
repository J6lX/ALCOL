package com.alcol.userservice.service;

import com.alcol.userservice.dto.UserDto;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;


public interface UserService extends UserDetailsService
{
    String createUser(UserDto.SignUpDto signUpDto, MultipartFile file) throws Exception;

    String updateUser(String user_id, MultipartFile file) throws IOException;

    UserDto.UserDetailDto getUserDetailByEmail(String email);

    String getNewAccessToken(String userId);

    UserDto.UserInfoDto getUserInfo(String userId) throws URISyntaxException;

    List<UserDto.UserBattleLogDto> getBattleLog(String userId) throws URISyntaxException;

    String getUserId(String nickName);

    List<String> getAllUserId();

    String getTier(int mmr);
}
