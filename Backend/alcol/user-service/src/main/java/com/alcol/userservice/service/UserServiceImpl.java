package com.alcol.userservice.service;

import com.alcol.userservice.dto.SignUpDto;
import com.alcol.userservice.jpa.UserEntity;
import com.alcol.userservice.jpa.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    public String createUser(SignUpDto signUpDto) {
        UserEntity userEntity = new UserEntity();
        userEntity.setEmail(signUpDto.getEmail());
        userEntity.setNickname(signUpDto.getNickname());
        userEntity.setEncryptedPwd(bCryptPasswordEncoder.encode(signUpDto.getPwd()));
        userEntity.setCreatedAt(LocalDateTime.now());
        userEntity.setUserId(UUID.randomUUID().toString());
        userRepository.save(userEntity);
        return userEntity.getUserId();
    }
}
