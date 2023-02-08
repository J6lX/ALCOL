package com.alcol.rankservice.config;

import com.alcol.rankservice.Interceptor.RedisOffInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfiguration implements WebMvcConfigurer
{
    @Autowired
    private RedisOffInterceptor redisOffException;

    @Override
    public void addInterceptors(InterceptorRegistry interceptorRegistry)
    {
        interceptorRegistry.addInterceptor(redisOffException).addPathPatterns("/**");
    }
}
