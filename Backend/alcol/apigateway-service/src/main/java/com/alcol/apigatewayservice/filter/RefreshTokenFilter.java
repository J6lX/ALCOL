package com.alcol.apigatewayservice.filter;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHeaders;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.xml.bind.DatatypeConverter;

@Component
@Slf4j
public class RefreshTokenFilter extends AbstractGatewayFilterFactory<RefreshTokenFilter.Config>
{
    private final Environment env;

    public RefreshTokenFilter(Environment env)
    {
        super(RefreshTokenFilter.Config.class);
        this.env = env;
    }

    public static class Config
    {
    }

    // refresh token 유효성 검사 메소드
    @Override
    public GatewayFilter apply(Config config)
    {
        return ((exchange, chain) ->
        {
            ServerHttpRequest request = exchange.getRequest();

            // 헤더에 refresh token 이 있는지 확인
            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION))
            {
                // 헤더에 refresh token 이 없는 경우 -> 재 로그인
                return onError(exchange, "This request does not have an refresh-token", HttpStatus.BAD_REQUEST);
            }

            // 헤더에서 refresh token 추출
            String authorizationHeader = request.getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
            String jwt = authorizationHeader.replace("Bearer", "");

            try {
                Jwts.parser()
                        .setSigningKey(DatatypeConverter.parseBase64Binary(env.getProperty("refresh-token.secret")))
                        .parseClaimsJws(jwt).getBody().getSubject();
            } catch (ExpiredJwtException e) {
                // refresh token 이 만료된 경우 -> 재 로그인
                return onError(exchange, "Refresh-token is expired", HttpStatus.BAD_REQUEST);
            } catch (Exception e) {
                // 잘못된 refresh token 을 보낸 경우 -> 재 로그인
                return onError(exchange, "Bad refresh-token", HttpStatus.BAD_REQUEST);
            }

            // user-service 에 refresh 요청(access token 재발급 요청) 진행
            return chain.filter(exchange);
        });
    }

    private Mono<Void> onError(ServerWebExchange exchange, String error, HttpStatus httpStatus)
    {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        log.error(error);
        return response.setComplete();
    }
}
