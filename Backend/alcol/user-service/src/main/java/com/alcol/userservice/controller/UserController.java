package com.alcol.userservice.controller;

import com.alcol.userservice.dto.SignUpDto;
import com.alcol.userservice.service.UserService;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHeaders;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.DatatypeConverter;


@RestController
@RequestMapping("/user-service")
@Slf4j
public class UserController
{
    private final UserService userService;
    private final Environment env;

    public UserController(UserService userService, Environment env)
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

    // 회원 가입 요청
    @PostMapping("/signUp")
    public ResponseEntity<String> createUser(@RequestBody SignUpDto signUpDto)
    {
        String userId = userService.createUser(signUpDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(userId);
    }

    // 새로운 access token 발급 요청
    @PostMapping("/refresh")
    public ResponseEntity<String> createUser(HttpServletRequest request, HttpServletResponse response)
    {
        log.info("새로운 access token 을 발급합니다.");
        String authorizationHeader = request.getHeaders(HttpHeaders.AUTHORIZATION).nextElement();
        String jwt = authorizationHeader.replace("Bearer", "");
        String userId = Jwts.parser()
                .setSigningKey(DatatypeConverter.parseBase64Binary(env.getProperty("refresh-token.secret")))
                .parseClaimsJws(jwt).getBody().getSubject();
        String newAccessToken = userService.getNewAccessToken(userId);
        response.addHeader("new-access-token", newAccessToken);
        return ResponseEntity.status(HttpStatus.CREATED).body("새로운 access token 이 발급되었습니다.");
    }
}
