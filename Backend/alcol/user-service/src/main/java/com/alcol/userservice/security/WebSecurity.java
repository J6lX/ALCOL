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
    private UserService userService;
    private TokenProvider tokenProvider;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

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
        // 하지만 '127.0.0.1' 로 요청된 요구는 그냥 허락한다.
        http.authorizeRequests()
                .antMatchers("/error/**").permitAll()
                .antMatchers("/**")
                .hasIpAddress("127.0.0.1")
                .and()
                .addFilter(getAuthenticationFilter());

        // h2-console 의 프레임 옵션을 사용하지 않음. 즉 h2-console 을 제대로 보기 위함
        http.headers().frameOptions().disable();
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
