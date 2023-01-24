package com.alcol.userservice.security;

import com.alcol.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebSecurity
{
    private final UserService userService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final Environment env;
    private final AuthenticationConfiguration authenticationConfiguration;

    @Autowired
    public WebSecurity(
            UserService userService,
            BCryptPasswordEncoder bCryptPasswordEncoder,
            Environment env,
            AuthenticationConfiguration authenticationConfiguration)
    {
        this.userService = userService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.env = env;
        this.authenticationConfiguration = authenticationConfiguration;
    }

    @Bean
    public AuthenticationManager authenticationManager() throws Exception
    {
        return this.authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception
    {
        // 토큰 방식을 사용하기 때문에 csrf 설정은 disable
        httpSecurity.csrf().disable();

        httpSecurity.authorizeRequests()
                // 회원 가입은 인증 절차 없이 허용
                .antMatchers("/user-service/signUp").permitAll()
                .and()
                // 그 외 요청은 모두 필터를 거치는 인증이 필요
                .addFilter(getAuthenticationFilter());

        // h2-console 의 프레임 옵션을 사용하지 않음. 즉 h2-console 을 제대로 보기 위함
        httpSecurity.headers().frameOptions().disable();

        return httpSecurity.build();
    }

    @Bean
    public AuthenticationFilter getAuthenticationFilter() throws Exception
    {
        AuthenticationFilter authenticationFilter = new AuthenticationFilter();
        authenticationFilter.setAuthenticationManager(authenticationManager());
        return authenticationFilter;
    }

    // select pwd from user_tb where email=?
    // encrypted_pwd = input_pwd
    @Bean
    AuthenticationManager authenticationManager(AuthenticationManagerBuilder builder) throws Exception {
        return builder.userDetailsService(userService).passwordEncoder(bCryptPasswordEncoder).and().build();
    }
}
