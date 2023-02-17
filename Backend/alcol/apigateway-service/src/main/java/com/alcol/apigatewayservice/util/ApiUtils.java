package com.alcol.apigatewayservice.util;

import com.alcol.apigatewayservice.dto.ResponseDto;
import com.alcol.apigatewayservice.error.CustomStatusCode;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

public class ApiUtils
{
    // ResponseDto 객체를 생성하는 메소드
    public static ResponseDto<?> makeResponse(CustomStatusCode customStatusCode)
    {
        return ResponseDto.builder()
                .success(false)
                .bodyData(null)
                .customCode(customStatusCode.getCustomCode())
                .description(customStatusCode.getDescription())
                .build();
    }

    // 최종 응답 객체를 리턴하는 메소드
    public static Mono<Void> getResponse(
            ServerWebExchange exchange,
            HttpStatus httpStatus,
            CustomStatusCode customStatusCode
    )
    {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        byte[] bytes = new byte[0];

        try {
            bytes = new ObjectMapper().writeValueAsString(
                            makeResponse(customStatusCode)
                    ).getBytes(StandardCharsets.UTF_8);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return response.writeWith(
                Flux.just(response.bufferFactory().wrap(bytes))
        );
    }
}
