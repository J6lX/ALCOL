package com.alcol.userservice.security;

import com.alcol.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@EnableWebSecurity
public class WebSecurity extends WebSecurityConfigurerAdapter
{
    private final UserService userService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final Environment env;

    @Autowired
    public WebSecurity(
            UserService userService,
            BCryptPasswordEncoder bCryptPasswordEncoder,
            Environment env
    )
    {
        this.userService = userService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.env = env;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception
    {
        // 토큰 방식을 사용하기 때문에 csrf 설정은 disable
        http.csrf().disable();

        http.authorizeRequests().antMatchers("/user-service/signUp").permitAll()
                .and()
                .addFilter(getAuthenticationFilter());

//        http.authorizeRequests().antMatchers("/**").authenticated()
//                .and()
//                .addFilter(getAuthenticationFilter());

        // h2-console 의 프레임 옵션을 사용하지 않음. 즉 h2-console 을 제대로 보기 위함
        http.headers().frameOptions().disable();
    }

    private AuthenticationFilter getAuthenticationFilter() throws Exception
    {
        AuthenticationFilter authenticationFilter = new AuthenticationFilter();
        authenticationFilter.setAuthenticationManager(authenticationManager());
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
