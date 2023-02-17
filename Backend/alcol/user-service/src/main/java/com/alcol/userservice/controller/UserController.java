package com.alcol.userservice.controller;

import com.alcol.userservice.dto.UserDto;
import com.alcol.userservice.error.CustomStatusCode;
import com.alcol.userservice.service.UserService;
import com.alcol.userservice.util.ApiUtils;
import com.alcol.userservice.util.RestTemplateUtils;
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
@Slf4j
public class UserController
{
    private final UserService userService;
    private final Environment env;
    private final RestTemplateUtils restTemplateUtils;

    public UserController(
            UserService userService,
            Environment env,
            RestTemplateUtils restTemplateUtils
    )
    {
        this.userService = userService;
        this.env = env;
        this.restTemplateUtils = restTemplateUtils;
    }

    /**
     * 회원 가입 요청
     * 로컬 환경에서는 사진 저장이 되지 않음
     * @param signUpDto
     * @param file
     * @return ResponseEntity<UserDto.ResponseDto<?>>
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
        log.info("UserController 의 createUser 메소드 실행");

        String retVal = userService.createUser(signUpDto, file);

        if (retVal.equals("DUPLICATE_EMAIL"))
        {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    ApiUtils.error(CustomStatusCode.DUPLICATE_USER_EMAIL)
            );
        }

        if (retVal.equals("DUPLICATE_NICKNAME"))
        {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    ApiUtils.error(CustomStatusCode.DUPLICATE_USER_NICKNAME)
            );
        }

        if (retVal.equals("PICTURE_UPLOAD_FAILURE"))
        {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    ApiUtils.error(CustomStatusCode.PICTURE_UPLOAD_FAILURE)
            );
        }

        log.info("UserController 의 createUser 메소드에서 회원가입 성공");

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiUtils.success(null, CustomStatusCode.CREATE_USER_SUCCESS)
        );
    }

    /**
     * 회원 정보 수정 요청
     * @param userUpdateDto
     * @param file
     * @return
     * @throws Exception
     */
    @PutMapping(value = "/", consumes = {
            MediaType.APPLICATION_JSON_VALUE,
            MediaType.MULTIPART_FORM_DATA_VALUE
    })
    public ResponseEntity<UserDto.ResponseDto<?>> updateUser(
            @RequestPart UserDto.UserUpdateDto userUpdateDto,
            @RequestPart @Nullable MultipartFile file
    )
            throws Exception
    {
        log.info("UserController 의 updateUser 메소드 실행");

        String retVal = userService.updateUser(userUpdateDto.getUserId(), file);

        if (retVal.equals("PICTURE_UPLOAD_FAILURE"))
        {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    ApiUtils.error(CustomStatusCode.PICTURE_UPLOAD_FAILURE)
            );
        }

        log.info("UserController 의 updateUser 메소드에서 회원 정보 수정 성공");

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiUtils.success(null, CustomStatusCode.UPDATE_USER_SUCCESS)
        );
    }

    /**
     * @param request
     * @return 새로운 access token 발급
     */
    @PostMapping("/refresh")
    public ResponseEntity<UserDto.ResponseDto<?>> refresh(HttpServletRequest request)
    {
        log.info("UserController 의 refresh 메소드 실행");

        String authorizationHeader = request.getHeaders(HttpHeaders.AUTHORIZATION).nextElement();
        String jwt = authorizationHeader.replace("Bearer", "");
        String userId = Jwts.parser()
                .setSigningKey(DatatypeConverter.parseBase64Binary(env.getProperty("refresh-token.secret")))
                .parseClaimsJws(jwt).getBody().getSubject();
        String newAccessToken = userService.getNewAccessToken(userId);

        Map<String, String> map = new HashMap<>();
        map.put("new_access_token", newAccessToken);

        log.info("UserController 의 refresh 메소드에서 새로운 access token 발급 성공");

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiUtils.success(map, CustomStatusCode.CREATE_NEW_ACCESS_TOKEN)
        );
    }

    /**
     * @param param
     * @return 닉네임, 레벨, 스피드전 티어, 효율성전 티어, 프로필 사진 저장 경로를 리턴
     * @throws URISyntaxException
     */
    @PostMapping("/getUserInfo")
    public UserDto.UserInfoDto getUserInfo(@RequestBody HashMap<String, Object> param)
            throws URISyntaxException
    {
        log.info("UserController 의 getUserInfo 메소드 실행");
        return userService.getUserInfo(param.get("user_id") + "");
    }

    /**
     * @param param
     * @return 배틀 로그 리스트를 리턴
     */
    @PostMapping("/getBattleLog")
    public List<UserDto.UserBattleLogDto> getBattleLog(@RequestBody HashMap<String, Object> param)
            throws URISyntaxException
    {
        log.info("UserController 의 getBattleLog 메소드 실행");
        return userService.getBattleLog(param.get("user_id") + "");
    }

    /**
     * @param param
     * @return 사용자 닉네임을 리턴
     */
    @PostMapping("/getUserId")
    public String getUserId(@RequestBody HashMap<String, Object> param)
    {
        log.info("UserController 의 getUserId 메소드 실행");
        return userService.getUserId(param.get("nickname") + "");
    }

    /**
     * @return 모든 사용자의 승패수, mmr 을 리턴
     */
    @PostMapping("/getAllUserId")
    public ResponseEntity<List<String>> getAllUserId()
    {
        log.info("UserController 의 getAllUserId 메소드 실행");
        List<String> list = userService.getAllUserId();
        return restTemplateUtils.sendResponse(list);
    }

    /**
     * @param mmr
     * @return 티어
     */
    @GetMapping("/getTier/{mmr}")
    public String getTier(@PathVariable("mmr") int mmr)
    {
        log.info("UserController 의 getTier 메소드 실행");
        return userService.getTier(mmr);
    }
}
