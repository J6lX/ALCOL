package com.alcol.userservice.security;

import com.alcol.userservice.dto.LoginDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
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
import java.util.ArrayList;

@Slf4j
public class AuthenticationFilter extends UsernamePasswordAuthenticationFilter
{
    // 1. 로그인 시도 시 해당 메소드로 가장 먼저 요청이 넘어옴
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException
    {
        try {
            LoginDto creds = new ObjectMapper().readValue(request.getInputStream(), LoginDto.class);
            // 사용자로부터 넘어온 이메일, 비밀번호를 가지고 토큰을 만들어서
            // AuthenticationManager 가 이 토큰을 db 와 비교하여 인증을 진행해주겠다는 뜻
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
        log.debug(((User)authResult.getPrincipal()).getUsername());
    }
}
