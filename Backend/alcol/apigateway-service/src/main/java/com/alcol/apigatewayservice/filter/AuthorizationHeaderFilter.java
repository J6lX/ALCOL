package com.alcol.apigatewayservice.filter;

import io.jsonwebtoken.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.xml.bind.DatatypeConverter;

// - 인가 플로우

// 1. 사용자가 로그인에 성공하면 서버로부터 토큰을 받음

// 2. 사용자는 해당 토큰 정보를 가지고 서버에 요청을 보냄

// 3. 서버는 토큰을 확인

@Component
@Slf4j
public class AuthorizationHeaderFilter extends AbstractGatewayFilterFactory<AuthorizationHeaderFilter.Config>
{
    private final Environment env;
    private final RouteLocatorBuilder routeLocatorBuilder;

    @Autowired
    public AuthorizationHeaderFilter(Environment env, RouteLocatorBuilder routeLocatorBuilder)
    {
        super(AuthorizationHeaderFilter.Config.class);
        this.env = env;
        this.routeLocatorBuilder = routeLocatorBuilder;
    }

    public static class Config
    {
    }

    // 토큰 검사 메소드
    @Override
    public GatewayFilter apply(Config config)
    {
        return ((exchange, chain) ->
        {
            ServerHttpRequest request = exchange.getRequest();

            // 우선 헤더에 인가와 관련된 정보가 있는지 확인
            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION))
            {
                return onError(exchange, "no authorization header", HttpStatus.UNAUTHORIZED);
            }

            String authorizationHeader = request.getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);

            // "Bearer" 라는 문자만 삭제
            String jwt = authorizationHeader.replace("Bearer", "");

            if (!isJwtValid(jwt))
            {
                return onError(exchange, "jwt token is not valid", HttpStatus.UNAUTHORIZED);
            }

            return chain.filter(exchange);
        });
    }

    private boolean isJwtValid(String jwt)
    {
        String userId;

        try {
            userId = Jwts.parser()
                    .setSigningKey(DatatypeConverter.parseBase64Binary(env.getProperty("token.secret")))
                    .parseClaimsJws(jwt).getBody().getSubject();
        } catch (ExpiredJwtException e) {
            // access 토큰이 만료된 경우
            // user-service 로 access 토큰, refresh 토큰 전송
            log.error("expired jwt !!!");
            return false;
        } catch (Exception e) {
            // 아예 잘못된 토큰을 보낸 경우
            // 이 경우는 무조건 다시 로그인하도록 함
            log.error("invalid jwt !!!");
            return false;
        }

        // 정상적인 토큰이므로 인증 완료
        return true;
    }

    // api-gateway 는 사용자 요청에 대한 반환값의 타입으로 Mono, Flux 라는 타입을 사용함
    // Mono : 단일값, Flux : 다중값 -> Spring WebFlux
    private Mono<Void> onError(ServerWebExchange exchange, String error, HttpStatus httpStatus)
    {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        log.error(error);
        return response.setComplete();
    }
}
