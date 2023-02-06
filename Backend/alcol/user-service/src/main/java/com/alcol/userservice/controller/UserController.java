package com.alcol.userservice.controller;

import com.alcol.userservice.dto.UserDto;
import com.alcol.userservice.error.CustomStatusCode;
import com.alcol.userservice.service.UserService;
import com.alcol.userservice.util.ApiUtils;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHeaders;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.DatatypeConverter;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/user-service")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Slf4j
public class UserController
{
    private final UserService userService;
    private final Environment env;

    public UserController(
            UserService userService,
            Environment env
    )
    {
        this.userService = userService;
        this.env = env;
    }

    @GetMapping("/hello")
    public String hello()
    {
        log.info("hello 호출 완료!!");
        return "Hello, this is msa";
    }

    /**
     * 회원 가입 요청
     * @param signUpDto
     * @param file
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/", consumes = {
            MediaType.APPLICATION_JSON_VALUE,
            MediaType.MULTIPART_FORM_DATA_VALUE
    })
    public ResponseEntity<UserDto.ResponseDto<?>> createUser(
            @RequestPart UserDto.SignUpDto signUpDto,
            @RequestPart @Nullable MultipartFile file
    )
            throws Exception
    {
        String retVal = userService.createUser(signUpDto, file);

        log.info("request : " + signUpDto.getEmail());

        if (retVal.equals("DUPLICATE_EMAIL"))
        {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    ApiUtils.error(CustomStatusCode.DUPLICATE_USER_EMAIL)
            );
        }

        log.info("request2 : " + signUpDto.getEmail());

        if (retVal.equals("DUPLICATE_NICKNAME"))
        {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    ApiUtils.error(CustomStatusCode.DUPLICATE_USER_NICKNAME)
            );
        }

        log.info("request3 : " + signUpDto.getEmail());

        if (retVal.equals("PICTURE_UPLOAD_FAILURE"))
        {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    ApiUtils.error(CustomStatusCode.PICTURE_UPLOAD_FAILURE)
            );
        }

        log.info("request4 : " + signUpDto.getEmail());

        // 회원가입은 상태가 성공이지만 body 에 담을 것이 없음
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiUtils.success(null, CustomStatusCode.CREATE_USER_SUCCESS)
        );
    }

    /**
     * 새로운 access token 발급 요청
     * @param request
     * @return
     */
    @PostMapping("/refresh")
    public ResponseEntity<UserDto.ResponseDto<?>> createUser(HttpServletRequest request)
    {
        String authorizationHeader = request.getHeaders(HttpHeaders.AUTHORIZATION).nextElement();
        String jwt = authorizationHeader.replace("Bearer", "");
        String userId = Jwts.parser()
                .setSigningKey(DatatypeConverter.parseBase64Binary(env.getProperty("refresh-token.secret")))
                .parseClaimsJws(jwt).getBody().getSubject();
        String newAccessToken = userService.getNewAccessToken(userId);

        Map<String, String> map = new HashMap<>();
        map.put("new_access_token", newAccessToken);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiUtils.success(map, CustomStatusCode.CREATE_NEW_ACCESS_TOKEN)
        );
    }

    /**
     * user_id 를 받아서 해당 유저의
     * 닉네임, 레벨, 스피드전 티어, 효율성전 티어, 프로필 사진 저장 경로를 리턴
     * @param userId
     * @return
     * @throws URISyntaxException
     */
    @PostMapping("/getUserInfo")
    public UserDto.UserInfoDto getUserInfo(@RequestParam(value="user_id") String userId)
            throws URISyntaxException
    {
        userService.test();
        return userService.getUserInfo(userId);
    }

    /**
     * user_id 를 받아서 해당 유저의 배틀 로그를 리턴
     * @param userId
     * @return
     */
    @PostMapping("/getBattleLog")
    public List<UserDto.UserBattleLogDto> getBattleLog(@RequestParam(value="user_id") String userId)
            throws URISyntaxException
    {
        return userService.getBattleLog(userId);
    }

    /**
     * 현재 경험치, 스피드전 mmr, 효율성전 mmr 을 받아서
     * 현재 레벨, 스피드전 티어, 효율성전 티어를 리턴
     * @param curExp
     * @param nowMmrBySpeed
     * @param nowMmrByOptimization
     * @return
     */
    @PostMapping("/getLevelAndTier")
    public UserDto.UserPlayDto getLevelAndTier
    (
            @RequestParam(value="cur_exp") String curExp,
            @RequestParam(value="now_mmr_by_speed") String nowMmrBySpeed,
            @RequestParam(value="now_mmr_by_optimization") String nowMmrByOptimization
    )
    {
        return userService.getLevelAndTier(curExp, nowMmrBySpeed, nowMmrByOptimization);
    }
}
