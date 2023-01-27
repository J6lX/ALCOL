package com.alcol.userservice.controller;

import com.alcol.userservice.dto.SignUpDto;
import com.alcol.userservice.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/user-service")
@Slf4j
public class UserController
{
    private final UserService userService;

    @Autowired
    public UserController(UserService userService)
    {
        this.userService = userService;
    }

    @GetMapping("/hello")
    public String hello(HttpServletRequest request) {
        log.info("hello 호출 완료!!");
        String authorizationHeader = request.getHeaders(HttpHeaders.AUTHORIZATION).nextElement();
        System.out.println("hello");
        return "Hello, this is msa";
    }

    @PostMapping("/signUp")
    public ResponseEntity<String> createUser(@RequestBody SignUpDto signUpDto)
    {
        String userId = userService.createUser(signUpDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(userId);
    }
}
