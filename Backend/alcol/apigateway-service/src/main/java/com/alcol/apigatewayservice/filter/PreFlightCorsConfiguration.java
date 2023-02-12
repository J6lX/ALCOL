package com.alcol.apigatewayservice.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.cors.reactive.CorsUtils;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Configuration
@Slf4j
public class PreFlightCorsConfiguration
{
    private static final String ALLOWED_ORIGIN = "*";
    private static final String ALLOWED_HEADERS = "Origin, X-requested-with, Authorization, Content-Type, Accept, user_id, refresh_token, access_token";
    private static final String ALLOWED_METHODS = "GET, PUT, POST, DELETE, OPTIONS";
    private static final String MAX_AGE = "3600";
    private static final String ALLOWED_CREDENTIALS = "false";

    @Bean
    public WebFilter corsFilter()
    {
        return (ServerWebExchange ctx, WebFilterChain chain) ->
        {
            ServerHttpRequest request = ctx.getRequest();

            log.info("PreFlightCorsConfiguration 클래스의 corsFilter 함수 실행");

            if (CorsUtils.isPreFlightRequest(request))
            {
                log.info("apigateway 서버가 preflight 요청을 받았습니다!!");
                ServerHttpResponse response = ctx.getResponse();
                HttpHeaders headers = response.getHeaders();
                headers.add("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
                headers.add("Access-Control-Allow-Headers", ALLOWED_HEADERS);
                headers.add("Access-Control-Allow-Methods", ALLOWED_METHODS);
                headers.add("Access-Control-Allow-Credentials", ALLOWED_CREDENTIALS);
                headers.add("Access-Control-Max-Age", MAX_AGE);

                if (request.getMethod() == HttpMethod.OPTIONS)
                {
                    log.info("apigateway 서바가 받은 preflight 요청은 OPTION 방식입니다.");
                    response.setStatusCode(HttpStatus.OK);
                    return Mono.empty();
                }
            }

            return chain.filter(ctx);
        };
    }
}
