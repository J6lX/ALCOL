package com.alcol.userservice.service;

import com.alcol.userservice.dto.UserDto;
import com.alcol.userservice.entity.UserEntity;
import com.alcol.userservice.entity.UserLevelEntity;
import com.alcol.userservice.entity.UserTierEntity;
import com.alcol.userservice.repository.UserLevelRepository;
import com.alcol.userservice.repository.UserRepository;
import com.alcol.userservice.repository.UserTierRepository;
import com.alcol.userservice.util.FileHandler;
import com.alcol.userservice.util.RestTemplateUtils;
import com.alcol.userservice.util.TokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.config.Configuration;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.data.redis.core.ZSetOperations;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    private final RestTemplateUtils restTemplateUtils;
    private final RedisTemplate<String, Object> redisTemplate;

    public UserServiceImpl(
            UserRepository userRepository,
            UserLevelRepository userLevelRepository,
            UserTierRepository userTierRepository,
            BCryptPasswordEncoder bCryptPasswordEncoder,
            TokenProvider tokenProvider,
            FileHandler fileHandler,
            RestTemplateUtils restTemplateUtils,
            RedisTemplate<String, Object> redisTemplate
    )
    {
        this.userRepository = userRepository;
        this.userLevelRepository = userLevelRepository;
        this.userTierRepository = userTierRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.tokenProvider = tokenProvider;
        this.fileHandler = fileHandler;
        this.restTemplateUtils = restTemplateUtils;
        this.redisTemplate = redisTemplate;
    }

    /**
     * DB 에 입력받은 이메일의 사용자가 저장되어 있는 지 확인
     * @param username 로그인 시 넘어오는 사용자 이메일
     * @return 사용자 정보
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
     * 회원 가입
     * @param signUpDto 회원가입 정보
     * @param file      유저 프로필 사진
     * @return 성공 시 사용자의 유저 아이디
     * @throws IOException
     */
    @Override
    public String createUser(
            @RequestBody UserDto.SignUpDto signUpDto,
            @RequestPart MultipartFile file
    )
            throws IOException
    {
        log.info("UserServiceImpl 의 createUser 메소드 실행");

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
        if (file != null && file.getSize() != 0)
        {
            if (!fileHandler.parseFileInfo(file, userEntity))
            {
                return "PICTURE_UPLOAD_FAILURE";
            }
        }

        // redis 에 사용자 경험치를 1 으로 저장, mmr 은 1200 으로 저장
        ValueOperations<String, Object> redisExp = redisTemplate.opsForValue();
        ZSetOperations<String, Object> redisMmr = redisTemplate.opsForZSet();
        redisExp.set("levelExp:" + userEntity.getUserId(), "1");
        redisMmr.add("speed", userEntity.getUserId(), 1200);
        redisMmr.add("optimization", userEntity.getUserId(), 1200);

        log.info("UserServiceImpl 의 createUser 메소드에서 redis 에 사용자 경험치=1, mmr=1200 으로 저장");

        // 회원가입 정보 저장
        userRepository.save(userEntity);

        log.info("UserServiceImpl 의 createUser 메소드에서 회원가입 성공");

        return userEntity.getUserId();
    }

    /**
     * 회원 정보 수정
     * @param user_id
     * @param file
     * @return
     */
    @Override
    public String updateUser(String user_id, MultipartFile file) throws IOException
    {
        log.info("UserServiceImpl 의 updateUser 메소드 실행");

        UserEntity userEntity = userRepository.findByUserId(user_id);

        if (file != null && file.getSize() != 0)
        {
            if (!fileHandler.parseFileInfo(file, userEntity))
            {
                return "PICTURE_UPLOAD_FAILURE";
            }
        }

        // redis 저장 파일 경로 업데이트
        HashOperations<String, String, Object> userInfo = redisTemplate.opsForHash();
        userInfo.put(
                "userInfo:" + userEntity.getUserId(),
                "stored_file_name",
                userEntity.getStoredFileName()
        );

        userRepository.save(userEntity);

        log.info("UserServiceImpl 의 updateUser 메소드에서 회원 정보 수정 성공");

        return userEntity.getUserId();
    }

    /**
     * @param userId
     * @return 새로운 access token 발급
     */
    @Override
    public String getNewAccessToken(String userId)
    {
        return tokenProvider.createAccessToken(userId);
    }

    /**
     * @param userId
     * @return 해당 유저의 닉네임, 레벨, 스피드전 티어, 효율성전 티어, 프로필 사진 저장 경로를 리턴
     * @throws URISyntaxException
     */
    @Override
    public UserDto.UserInfoDto getUserInfo(String userId) throws URISyntaxException
    {
        log.info("UserServiceImpl 의 getUserInfo 메소드 실행");

        // 닉네임, 사진 정보 가져옴
        UserEntity userEntity = userRepository.findByUserId(userId);

        int curExp, curSpeedMmr, curOptimizationMmr, level;
        String speedTier, optimizationTier;
        ValueOperations<String, Object> redisExp = redisTemplate.opsForValue();
        ZSetOperations<String, Object> redisMmr = redisTemplate.opsForZSet();

        log.info("userId : " + userId);
        log.info("UserEntity : " + userEntity);

        try {
            // redis 에서 해당 유저의 경험치, 스피드전 mmr, 효율성전 mmr 을 가져옴
            curExp = (int)redisExp.get("levelExp:" + userId);
            curSpeedMmr = (int)Math.round(redisMmr.score("speed", userId));
            curOptimizationMmr = (int)Math.round(redisMmr.score("optimization", userId));
            log.info("getUserInfo 메소드에서 레디스에서 데이터를 잘 읽어옴");
        }
        catch (NullPointerException e) {

            // redis 에 정보가 없을 때 log-service 로 요청
            // user-service -> log-service
            // param : user_id
            // return : 해당 유저의 경험치, 스피드전 mmr, 효율성전 mmr 을 리턴

            log.info("UserServiceImpl 의 getUserInfo 메소드에서 user_id 에 대한 경험치, mmr 정보가 " +
                    "redis 에 없어서 log-service 에서 가져옵니다.");

            MultiValueMap<String, String> bodyData = new LinkedMultiValueMap<>();
            bodyData.add("user_id", userId);
            ResponseEntity<UserDto.UserPlayDto> response = restTemplateUtils.sendRequest(
                    bodyData,
                    "http://i8b303.p.ssafy.io:9005/log-service/getExpAndMmr",
                    new ParameterizedTypeReference<UserDto.UserPlayDto>() {}
            );

            curExp = response.getBody().getExp();
            curSpeedMmr = response.getBody().getSpeedMmr();
            curOptimizationMmr = response.getBody().getOptimizationMmr();

            // 데이터를 redis 에 저장
            redisExp.set("levelExp:" + userEntity.getUserId(), curExp);
            redisMmr.add("speed", userEntity.getUserId(), curSpeedMmr);
            redisMmr.add("optimization", userEntity.getUserId(), curOptimizationMmr);
        }

        UserLevelEntity userLevelEntity =
                userLevelRepository.findTopBySumExpLessThanEqualOrderByLevelDesc(curExp);

        UserTierEntity userTierEntityBySpeed =
                userTierRepository.findByMinMmrLessThanEqualAndMaxMmrGreaterThanEqual(
                        curSpeedMmr, curSpeedMmr
                );

        UserTierEntity userTierEntityByOptimization =
                userTierRepository.findByMinMmrLessThanEqualAndMaxMmrGreaterThanEqual(
                        curOptimizationMmr, curOptimizationMmr
                );

        try {
            level = userLevelEntity.getLevel();
            speedTier = userTierEntityBySpeed.getTier();
            optimizationTier = userTierEntityByOptimization.getTier();
        }
        catch (NullPointerException e) {
            level = 0;
            speedTier = "BRONZE5";
            optimizationTier = "BRONZE5";
        }

        log.info("exp: " + curExp);
        log.info("speedMmr : " + curSpeedMmr);
        log.info("optimizationMmr : " + curOptimizationMmr);

        log.info("level : " + level);
        log.info("speedTier: " + speedTier);
        log.info("optimizationTier : " + optimizationTier);

        log.info("UserServiceImpl 의 getUserInfo 메소드에서 사용자 레벨, 티어 정보 가져오기 성공");

        return UserDto.UserInfoDto.builder()
                .nickname(userEntity.getNickname())
                .storedFileName(userEntity.getStoredFileName())
                .level(level)
                .speedTier(speedTier)
                .optimizationTier(optimizationTier)
                .build();
    }

    /**
     * @param userId
     * @return 해당 유저의 배틀 로그 리스트를 리턴
     */
    @Override
    public List<UserDto.UserBattleLogDto> getBattleLog(String userId)
            throws URISyntaxException
    {
        log.info("UserServiceImpl 메소드의 getBattleLog 메소드 실행");

        MultiValueMap<String, String> bodyData = new LinkedMultiValueMap<>();
        bodyData.add("user_id", userId);
        ResponseEntity<List<UserDto.UserBattleLogDto>> response = restTemplateUtils.sendRequest(
                bodyData,
                "http://i8b303.p.ssafy.io:9005/log-service/getBattleLog",
//                "http://localhost:9005/log-service/getBattleLog",
                new ParameterizedTypeReference<List<UserDto.UserBattleLogDto>>() {}
        );

        List<UserDto.UserBattleLogDto> list = response.getBody();
        for (UserDto.UserBattleLogDto userBattleLogDto : list)
        {
            UserEntity userEntity = userRepository.findByUserId(userBattleLogDto.getOtherUserId());
            userBattleLogDto.setOtherUserNickname(userEntity.getNickname());
        }

        log.info("UserServiceImpl 메소드의 getBattleLog 메소드 종료");

        return list;
    }

    @Override
    public String getUserId(String nickName)
    {
        log.info("UserServiceImpl 메소드의 getUserId 메소드 실행");
        UserEntity userEntity = userRepository.findByNickname(nickName);
        if (userEntity == null)
        {
            return "noneUserId";
        }
        else
        {
            return userEntity.getUserId();
        }
    }

    @Override
    public List<String> getAllUserId()
    {
        log.info("UserServiceImpl 메소드의 getAllUserId 메소드 실행");
        List<String> list = new ArrayList<>();
        List<UserEntity> userEntityList = userRepository.findAll();
        for (UserEntity userEntity : userEntityList)
        {
            list.add(userEntity.getUserId());
        }
        return list;
    }

    @Override
    public String getTier(int mmr)
    {
        log.info("UserServiceImpl 메소드의 getTier 메소드 실행");
        UserTierEntity userTierEntity = userTierRepository
                .findByMinMmrLessThanEqualAndMaxMmrGreaterThanEqual(mmr, mmr);
        return userTierEntity.getTier();
    }

    @Override
    public UserDto.UserDetailDto getUserDetailByEmail(String email)
    {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT)
                .setFieldAccessLevel(Configuration.AccessLevel.PRIVATE)
                .setFieldMatchingEnabled(true);

        UserEntity userEntity = userRepository.findByEmail(email);

        if (userEntity == null)
        {
            throw new UsernameNotFoundException(email);
        }

        return modelMapper.map(userEntity, UserDto.UserDetailDto.class);
    }
}
