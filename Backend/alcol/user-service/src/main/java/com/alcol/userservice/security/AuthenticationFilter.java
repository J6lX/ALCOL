package com.alcol.userservice.security;

import com.alcol.userservice.dto.LoginDto;
import com.alcol.userservice.dto.UserDto;
import com.alcol.userservice.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Key;
import java.util.ArrayList;
import java.util.Date;

// 로그인 플로우

// 1. 로그인 시도 시 시큐리티에서 등록한 필터(AuthenticationFilter)로 요청이 넘어옴

// 2. attemptAuthentication 메소드 실행

// 3. 사용자로부터 넘어온 이메일, 비밀번호를 가지고 토큰을 만들어서
// AuthenticationManager 가 이 토큰을 db 와 비교하여 인증을 진행

// 4. 이 때, 실질적인 인증은 UserServiceImpl 클래스에 있는 loadUserByUsername 메소드에서 진행
// 단계 4. 를 위한 밑작업은 2 가지가 필요하다.
// 4-1. UserService 는 UserDetailsService 를 상속하여 loadUserByUsername 을 구현해야함
// 4-2. Security 에서 configure 메소드를 통해 UserService 와 비밀번호 암복호화 클래스를 등록해야함
// 그래야 로그인 요청으로 온 평문 비밀번호와 db 에 저장되어 있는 암호화 비밀번호를 비교할 수 있음

// 5. 로그인 성공 시 successfulAuthentication 메소드로 넘어감

@Slf4j
public class AuthenticationFilter extends UsernamePasswordAuthenticationFilter
{
    private final UserService userService;
    private final Environment env;

    @Autowired
    public AuthenticationFilter(
            UserService userService,
            Environment env,
            AuthenticationManager authenticationManager
    )
    {
        this.userService = userService;
        this.env = env;
        super.setAuthenticationManager(authenticationManager);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException
    {
        try {

            LoginDto creds = new ObjectMapper().readValue(request.getInputStream(), LoginDto.class);

            return getAuthenticationManager().authenticate(
                    new UsernamePasswordAuthenticationToken(
                            creds.getEmail(),
                            creds.getPwd(),
                            new ArrayList<>())  // 권한들을 집어넣음
            );
        } catch (IOException e) {
            throw new RuntimeException();
        }
    }

    // 로그인 성공 시 어떤 처리를 해주고, 어떤 값을 반환해줄지를 설정
    @Override
    protected void successfulAuthentication
    (
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain,
            Authentication authResult
    )
            throws IOException, ServletException
    {
        Key key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
        String email = ((User)authResult.getPrincipal()).getUsername();
        UserDto userDetails = userService.getUserDetailByEmail(email);

        String token = Jwts.builder()
                // 어떤 내용으로 토큰을 만들 것인지
                .setSubject(userDetails.getUserId())
                // 토큰 유효기간 설정
                .setExpiration(new Date(System.currentTimeMillis()
                        + Long.parseLong(env.getProperty("token.expiration_time"))))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();

        response.addHeader("token", token);
        response.addHeader("userId", userDetails.getUserId());
    }
}
