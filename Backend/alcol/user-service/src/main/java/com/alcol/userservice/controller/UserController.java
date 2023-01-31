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
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.DatatypeConverter;
import java.util.List;


@RestController
@RequestMapping("/user-service")
@Slf4j
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserController
{
    private final UserService userService;
    private final Environment env;
    private final RestTemplate restTemplate;

    public UserController(
            UserService userService,
            Environment env,
            RestTemplate restTemplate
    )
    {
        this.userService = userService;
        this.env = env;
        this.restTemplate = restTemplate;
    }

    @GetMapping("/hello")
    public String hello()
    {
        log.info("hello 호출 완료!!");
        return "Hello, this is msa";
    }

    // 회원 가입 요청
    @PostMapping(value = "/", consumes = {
            MediaType.APPLICATION_JSON_VALUE,
            MediaType.MULTIPART_FORM_DATA_VALUE
    })
    public ResponseEntity<UserDto.ResponseDto<?>> createUser(
            @RequestPart UserDto.SignUpDto signUpDto,
            @RequestPart MultipartFile file
    )
            throws Exception
    {
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

        // 회원가입은 상태가 성공이지만 body 에 담을 것이 없음
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiUtils.success(null, CustomStatusCode.CREATE_USER_SUCCESS)
        );
    }

    // 새로운 access token 발급 요청
    @PostMapping("/refresh")
    public ResponseEntity<UserDto.ResponseDto<?>> createUser(
            HttpServletRequest request,
            HttpServletResponse response
    )
    {
        log.info("새로운 access token 을 발급합니다.");

        String authorizationHeader = request.getHeaders(HttpHeaders.AUTHORIZATION).nextElement();
        String jwt = authorizationHeader.replace("Bearer", "");
        String userId = Jwts.parser()
                .setSigningKey(DatatypeConverter.parseBase64Binary(env.getProperty("refresh-token.secret")))
                .parseClaimsJws(jwt).getBody().getSubject();
        String newAccessToken = userService.getNewAccessToken(userId);

        response.addHeader("new-access-token", newAccessToken);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiUtils.success(null, CustomStatusCode.CREATE_NEW_ACCESS_TOKEN)
        );
    }

    // RestTemplate 을 통한 서비스 간 호출 테스트
    @GetMapping("/restTemplate")
    public ResponseEntity<List> restTemplateTestToLogService()
    {
        MultiValueMap<String, String> bodyData = new LinkedMultiValueMap<>();
        bodyData.add("param", "this is plus data from user-service");
        String url = "http://localhost:9005/log-service/getLog";
        ResponseEntity<List> logs = restTemplate.postForEntity(
                url,
                bodyData,
                List.class
        );
        return logs;
    }

}
