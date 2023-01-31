package com.alcol.userservice.security;

import com.alcol.userservice.service.UserService;
import com.alcol.userservice.util.TokenProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@EnableWebSecurity
public class WebSecurity extends WebSecurityConfigurerAdapter
{
    private final UserService userService;
    private final TokenProvider tokenProvider;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public WebSecurity(
            UserService userService,
            TokenProvider tokenProvider,
            BCryptPasswordEncoder bCryptPasswordEncoder
    )
    {
        this.userService = userService;
        this.tokenProvider = tokenProvider;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception
    {
        // 토큰 방식을 사용하기 때문에 csrf 설정은 disable
        http.csrf().disable();

        // 모든 요청은 시큐리티에 의해 인증이 요구된다.
        http.authorizeRequests()
                .antMatchers("/**")
                .hasIpAddress("13.209.10.133")
                .and()
                .addFilter(getAuthenticationFilter());
    }

    private AuthenticationFilter getAuthenticationFilter() throws Exception
    {
        AuthenticationFilter authenticationFilter = new AuthenticationFilter(
                userService,
                tokenProvider,
                authenticationManager()
        );
        return authenticationFilter;
    }

    // select pwd from user_tb where email=?
    // encrypted_pwd = input_pwd
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception
    {
        auth.userDetailsService(userService).passwordEncoder(bCryptPasswordEncoder);
    }

}
