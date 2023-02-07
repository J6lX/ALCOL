package com.alcol.problemservice.util;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.Charset;
import java.util.Map;

@Component
public class RestTemplateUtils
{
    private final RestTemplate restTemplate;

    public RestTemplateUtils(RestTemplate restTemplate)
    {
        this.restTemplate = restTemplate;
    }

    public <T, S>ResponseEntity sendRequest(
            MultiValueMap<String, T> bodyData,
            String uri,
            ParameterizedTypeReference<S> type
    )
            throws URISyntaxException
    {
        RequestEntity<Map> request = RequestEntity
                .post(new URI(uri))
                .accept(MediaType.APPLICATION_FORM_URLENCODED)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(bodyData);

        return restTemplate.exchange(
                uri,
                HttpMethod.POST,
                request,
                type
        );
    }

    public <T>ResponseEntity sendResponse(T body)
    {
        HttpHeaders header = new HttpHeaders();
        header.setContentType(new MediaType("application", "json", Charset.forName("UTF-8")));
        return new ResponseEntity<>(body, header, HttpStatus.OK);
    }
}
