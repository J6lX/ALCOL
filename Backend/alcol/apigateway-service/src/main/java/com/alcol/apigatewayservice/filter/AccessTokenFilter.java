package com.alcol.apigatewayservice.filter;

import com.alcol.apigatewayservice.error.CustomStatusCode;
import com.alcol.apigatewayservice.util.ApiUtils;
import io.jsonwebtoken.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHeaders;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import javax.xml.bind.DatatypeConverter;

// - 인가 플로우

// 1. 사용자가 로그인에 성공하면 서버로부터 access token, refresh token 을 받음

// 2. 사용자는 해당 서버에 요청을 보낼 때 access token 을 같이 보냄

// 3. apigateway 는  access token 을 확인
// 3-1. 토큰이 정상적이면 요청한 서비스로 이동
// 3-2. 토큰이 만료되었으면 클라이언트에게 refresh 요청(access token 재발급)을 하라고 알림
// 3-3. 잘못된 토큰이면 클라이언트에게 재 로그인을 하라고 알림

@Component
@Slf4j
public class AccessTokenFilter extends AbstractGatewayFilterFactory<AccessTokenFilter.Config>
{
    private final Environment env;

    public AccessTokenFilter(Environment env)
    {
        super(AccessTokenFilter.Config.class);
        this.env = env;
    }

    public static class Config
    {
    }

    // access token 유효성 검사 메소드
    @Override
    public GatewayFilter apply(Config config)
    {
        return ((exchange, chain) ->
        {
            ServerHttpRequest request = exchange.getRequest();

            // 헤더에 access token 이 있는지 확인
            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION))
            {
                // 헤더에 access token 이 없는 경우 -> 재 로그인
                return ApiUtils.getResponse(
                        exchange,
                        HttpStatus.BAD_REQUEST,
                        CustomStatusCode.NOT_ACCESS_TOKEN_IN_HEADER
                );
            }

            // 헤더에서 access token 추출
            String authorizationHeader = request.getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
            String jwt = authorizationHeader.replace("Bearer", "");

            try {
                Jwts.parser()
                        .setSigningKey(DatatypeConverter.parseBase64Binary(env.getProperty("access-token.secret")))
                        .parseClaimsJws(jwt).getBody().getSubject();
            } catch (ExpiredJwtException e) {
                // access token 이 만료된 경우
                // 클라이언트에게 refresh 요청을 하라고 알림
                return ApiUtils.getResponse(
                        exchange,
                        HttpStatus.UNAUTHORIZED,
                        CustomStatusCode.ACCESS_TOKEN_EXPIRED
                );
            } catch (Exception e) {
                // 잘못된 access token 을 보낸 경우 -> 재 로그인
                return ApiUtils.getResponse(
                        exchange,
                        HttpStatus.BAD_REQUEST,
                        CustomStatusCode.BAD_ACCESS_TOKEN
                );
            }

            // 정상적인 access token 이 왔으므로 기존 요청 진행
            return chain.filter(exchange);
        });
    }
}
