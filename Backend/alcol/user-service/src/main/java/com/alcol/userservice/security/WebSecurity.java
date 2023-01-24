package com.alcol.userservice.security;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebSecurity
public class WebSecurity {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {

        // 토큰 방식을 사용하기 때문에 csrf 설정은 disable
        httpSecurity.csrf().disable();

        // 회원가입 요청은 인가없이 통과
        httpSecurity.authorizeRequests().antMatchers("/users/**").permitAll();

        // h2-console 의 프레임 옵션을 사용하지 않음. 즉 h2-console 을 제대로 보기 위함
        httpSecurity.headers().frameOptions().disable();

        return httpSecurity.build();
    }
}
