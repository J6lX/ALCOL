package com.alcol.rankservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class RankServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(RankServiceApplication.class, args);
    }

}
