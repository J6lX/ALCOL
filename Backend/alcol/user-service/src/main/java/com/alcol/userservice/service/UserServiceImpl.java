package com.alcol.userservice.service;

import com.alcol.userservice.dto.UserDto;
import com.alcol.userservice.entity.UserEntity;
import com.alcol.userservice.repository.UserRepository;
import com.alcol.userservice.util.FileHandler;
import com.alcol.userservice.util.TokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.config.Configuration;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

@Service
@Slf4j
public class UserServiceImpl implements UserService
{
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final TokenProvider tokenProvider;
    private final FileHandler fileHandler;

    public UserServiceImpl(
            UserRepository userRepository,
            BCryptPasswordEncoder bCryptPasswordEncoder,
            TokenProvider tokenProvider,
            FileHandler fileHandler
    )
    {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.tokenProvider = tokenProvider;
        this.fileHandler = fileHandler;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException
    {
        UserEntity userEntity = userRepository.findByEmail(username);

        // 로그인 실패
        if (userEntity == null)
        {
            throw new UsernameNotFoundException(username);
        }

        return new User(
                userEntity.getEmail(),
                userEntity.getEncryptedPwd(),
                true, true, true, true, new ArrayList<>()
        );
    }

    @Override
    public String createUser(
            @RequestBody UserDto.SignUpDto signUpDto,
            @RequestPart MultipartFile file
    )
            throws IOException
    {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT);

        // 중복 이메일 체크
        UserEntity userEntity = userRepository.findByEmail(signUpDto.getEmail());
        if (userEntity != null)
        {
            return "DUPLICATE_EMAIL";
        }

        // 중복 닉네임 체크
        userEntity = userRepository.findByNickname(signUpDto.getNickname());
        if (userEntity != null)
        {
            return "DUPLICATE_NICKNAME";
        }

        // UserEntity 에는 setter 가 구현되어 있으므로 mapper 설정이 필요없음
        userEntity = modelMapper.map(signUpDto, UserEntity.class);

        userEntity.setEncryptedPwd(bCryptPasswordEncoder.encode(signUpDto.getPwd()));
        userEntity.setCreatedAt(LocalDateTime.now());
        userEntity.setUserId(UUID.randomUUID().toString());

        // 사진 저장 테스트
        if (!fileHandler.parseFileInfo(file, userEntity))
        {
            return "PICTURE_UPLOAD_FAILURE";
        }

        // 회원가입 정보 저장
        userRepository.save(userEntity);
        return userEntity.getUserId();
    }

    @Override
    public UserDto.UserDetailDto getUserDetailByEmail(String email)
    {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT)
                // UserDto.UserDetailDto 에 setter 가 없으므로 필요한 설정
                .setFieldAccessLevel(Configuration.AccessLevel.PRIVATE)
                .setFieldMatchingEnabled(true);

        UserEntity userEntity = userRepository.findByEmail(email);

        if (userEntity == null)
        {
            throw new UsernameNotFoundException(email);
        }

        return modelMapper.map(userEntity, UserDto.UserDetailDto.class);
    }

    @Override
    public String getNewAccessToken(String userId)
    {
        return tokenProvider.createAccessToken(userId);
    }
}
