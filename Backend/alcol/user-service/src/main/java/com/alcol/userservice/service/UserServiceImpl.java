package com.alcol.userservice.service;

import com.alcol.userservice.dto.UserDto;
import com.alcol.userservice.entity.UserEntity;
import com.alcol.userservice.entity.UserLevelEntity;
import com.alcol.userservice.entity.UserTierEntity;
import com.alcol.userservice.repository.UserLevelRepository;
import com.alcol.userservice.repository.UserRepository;
import com.alcol.userservice.repository.UserTierRepository;
import com.alcol.userservice.util.FileHandler;
import com.alcol.userservice.util.TokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.config.Configuration;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
public class UserServiceImpl implements UserService
{
    private final UserRepository userRepository;
    private final UserLevelRepository userLevelRepository;
    private final UserTierRepository userTierRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final TokenProvider tokenProvider;
    private final FileHandler fileHandler;
    private final RestTemplate restTemplate;

    public UserServiceImpl(
            UserRepository userRepository,
            UserLevelRepository userLevelRepository,
            UserTierRepository userTierRepository,
            BCryptPasswordEncoder bCryptPasswordEncoder,
            TokenProvider tokenProvider,
            FileHandler fileHandler,
            RestTemplate restTemplate
    )
    {
        this.userRepository = userRepository;
        this.userLevelRepository = userLevelRepository;
        this.userTierRepository = userTierRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.tokenProvider = tokenProvider;
        this.fileHandler = fileHandler;
        this.restTemplate = restTemplate;
    }

    /**
     * DB 에 입력받은 이메일의 사용자가 저장되어 있는 지 확인
     * @param username 로그인 시 넘어오는 사용자 이메일
     * @return
     * @throws UsernameNotFoundException
     */
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

    /**
     *
     * @param signUpDto 회원가입 정보
     * @param file      유저 프로필 사진
     * @return 성공 시 사용자의 유저 아이디
     * @throws IOException
     */
    // 회원 가입 메소드
    @Override
    public String createUser(
            @RequestBody UserDto.SignUpDto signUpDto,
            @RequestPart MultipartFile file
    )
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

        // 프로필 사진이 회원 가입 시 같이 전달된 경우
        if (file != null && file.getSize() != 0) {
            if (!fileHandler.parseFileInfo(file, userEntity)) {
                return "PICTURE_UPLOAD_FAILURE";
            }
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

    /**
     * user_id 를 받아서 해당 유저의 레벨, 티어를 반환
     * @param userId
     * @return
     * @throws URISyntaxException
     */
    @Override
    public UserDto.UserInfoDto getUserInfo(String userId)
            throws URISyntaxException
    {
        // 닉네임, 사진 정보는 가져옴
        UserEntity userEntity = userRepository.findByUserId(userId);

        // 레디스에서 mmr, 경험치 정보를 가져와서 레벨, 티어를 추출
        // 레디스에 정보가 없으면 log-service 로 mmr, 경험치 받아오기

        MultiValueMap<String, String> bodyData = new LinkedMultiValueMap<>();
        bodyData.add("user_id", userId);
        String url = "http://localhost:9005/log-service/getLevelAndTier";

        RequestEntity<Map> request = RequestEntity
                .post(new URI(url))
                .accept(MediaType.APPLICATION_FORM_URLENCODED)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(bodyData);

        // 레디스에 mmr, 경험치 정보가 없을 때 요청
        // user-service -> log-service
        // log-service 에게 user_id 를 보내서
        // 해당 유저의 레벨, 스피드전 티어, 효율성전 티어를 리턴받음
        ResponseEntity<UserDto.UserPlayDto> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                request,
                new ParameterizedTypeReference<UserDto.UserPlayDto>() {}
        );

        return UserDto.UserInfoDto.builder()
                .nickname(userEntity.getNickname())
                .storedFileName(userEntity.getStoredFileName())
                .level(String.valueOf(response.getBody().getLevel()))
                .speedTier(String.valueOf(response.getBody().getSpeedTier()))
                .optimizationTier(String.valueOf(response.getBody().getOptimizationTier()))
                .build();
    }

    @Override
    public UserDto.UserPlayDto getLevelAndTier(String curExp, String nowMmrBySpeed, String nowMmrByOptimization)
    {
        UserLevelEntity userLevelEntity =
                userLevelRepository.findTopBySumExpLessThanEqualOrderByLevelDesc(Integer.parseInt(curExp));

        UserTierEntity userTierEntityBySpeed =
                userTierRepository.findByMinMmrLessThanEqualAndMaxMmrGreaterThanEqual(
                        Integer.parseInt(nowMmrBySpeed),
                        Integer.parseInt(nowMmrBySpeed)
                );

        UserTierEntity userTierEntityByOptimization =
                userTierRepository.findByMinMmrLessThanEqualAndMaxMmrGreaterThanEqual(
                        Integer.parseInt(nowMmrByOptimization),
                        Integer.parseInt(nowMmrByOptimization)
                );

        int level = userLevelEntity.getLevel();
        String tierBySpeed = userTierEntityBySpeed.getTier();
        String tierByOptimization = userTierEntityByOptimization.getTier();

        return UserDto.UserPlayDto.builder()
                .level(level + "")
                .speedTier(tierBySpeed)
                .optimizationTier(tierByOptimization)
                .build();
    }

    public void test() throws URISyntaxException
    {
        MultiValueMap<String, List> bodyData = new LinkedMultiValueMap<>();
        List<String> probNoList = new ArrayList<>();
        probNoList.add("10");
        probNoList.add("20");
        probNoList.add("30");
        bodyData.add("prob_no_list", probNoList);

        String url = "http://localhost:9005/log-service/test";

        RequestEntity<Map> request = RequestEntity
                .post(new URI(url))
                .accept(MediaType.APPLICATION_FORM_URLENCODED)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(bodyData);

        ResponseEntity<List<UserDto.UserPlayDto>> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                request,
                new ParameterizedTypeReference<List<UserDto.UserPlayDto>>() {}
        );

        return;
    }
}
