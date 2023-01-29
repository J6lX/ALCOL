package com.alcol.userservice.service;

import com.alcol.userservice.dto.SignUpDto;
import com.alcol.userservice.dto.UserDto;
import com.alcol.userservice.jpa.UserEntity;
import com.alcol.userservice.jpa.UserRepository;
import com.alcol.userservice.util.TokenProvider;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService
{
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final TokenProvider tokenProvider;

    public UserServiceImpl(
            UserRepository userRepository,
            BCryptPasswordEncoder bCryptPasswordEncoder,
            TokenProvider tokenProvider
    )
    {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException
    {
        UserEntity userEntity = userRepository.findByEmail(username);

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
    public String createUser(SignUpDto signUpDto)
    {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        UserEntity userEntity = modelMapper.map(signUpDto, UserEntity.class);
        userEntity.setEncryptedPwd(bCryptPasswordEncoder.encode(signUpDto.getPwd()));
        userEntity.setCreatedAt(LocalDateTime.now());
        userEntity.setUserId(UUID.randomUUID().toString());
        userRepository.save(userEntity);
        return userEntity.getUserId();
    }

    @Override
    public UserDto getUserDetailByEmail(String email)
    {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        UserEntity userEntity = userRepository.findByEmail(email);

        if (userEntity == null)
        {
            throw new UsernameNotFoundException(email);
        }

        return modelMapper.map(userEntity, UserDto.class);
    }

    @Override
    public String getNewAccessToken(String userId)
    {
        return tokenProvider.createAccessToken(userId);
    }
}
