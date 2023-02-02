package com.alcol.userservice.security;

import com.alcol.userservice.dto.UserDto;
import com.alcol.userservice.error.CustomStatusCode;
import com.alcol.userservice.service.UserService;
import com.alcol.userservice.util.ApiUtils;
import com.alcol.userservice.util.TokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

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
// 6. 로그인 실패 시 unsuccessfulAuthentication 메소드로 넘어감

@Slf4j
public class AuthenticationFilter extends UsernamePasswordAuthenticationFilter
{
    private final UserService userService;
    private final TokenProvider tokenProvider;

    public AuthenticationFilter(
            UserService userService,
            TokenProvider tokenProvider,
            AuthenticationManager authenticationManager
    )
    {
        this.userService = userService;
        this.tokenProvider = tokenProvider;
        super.setAuthenticationManager(authenticationManager);
    }

    @Override
    public Authentication attemptAuthentication (
            HttpServletRequest request,
            HttpServletResponse response
    )
            throws AuthenticationException
    {
        try {
            UserDto.LoginDto creds = new ObjectMapper().readValue(
                    request.getInputStream(),
                    UserDto.LoginDto.class
            );

            return getAuthenticationManager().authenticate(
                    new UsernamePasswordAuthenticationToken(
                            creds.getEmail(),
                            creds.getPwd(),
                            // 권한들을 집어넣음
                            new ArrayList<>()
                    )
            );
        } catch (IOException e) {
            throw new RuntimeException();
        }
    }

    // 로그인 성공 시
    // access token, refresh token 을 생성 후 userId 와 함께 반환
    @Override
    protected void successfulAuthentication
    (
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain,
            Authentication authResult
    )
            throws IOException
    {
        String email = ((User)authResult.getPrincipal()).getUsername();
        UserDto.UserDetailDto userDetails = userService.getUserDetailByEmail(email);
        String accessToken = tokenProvider.createAccessToken(userDetails.getUserId());
        String refreshToken = tokenProvider.createRefreshToken(userDetails.getUserId());

        Map<String, String> map = new HashMap<>();
        map.put("user_id", userDetails.getUserId());
        map.put("access_token", accessToken);
        map.put("refresh_token", refreshToken);

        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8");

        response.getWriter().write(
                new ObjectMapper().writeValueAsString(
                        ApiUtils.success(
                                map,
                                CustomStatusCode.LOGIN_SUCCESS
                        )
                )
        );
    }

    // 로그인 실패 시
    @Override
    protected void unsuccessfulAuthentication(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException failed
    )
            throws IOException
    {
        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8");
        response.setStatus(HttpServletResponse.SC_CONFLICT);

        response.getWriter().write(
                new ObjectMapper().writeValueAsString(
                        ApiUtils.error(CustomStatusCode.LOGIN_FAILURE)
                )
        );
    }
}
