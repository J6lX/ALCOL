package com.alcol.userservice.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.security.Key;
import java.util.Date;

@Component
public class TokenProvider
{
    private final Environment env;

    public TokenProvider(Environment env)
    {
        this.env = env;
    }

    public String createAccessToken(String userId)
    {
        byte[] accessTokenSecretBytes = DatatypeConverter.parseBase64Binary(env.getProperty("access-token.secret"));
        Key keyForAccessToken = new SecretKeySpec(accessTokenSecretBytes, SignatureAlgorithm.HS512.getJcaName());

        return Jwts.builder()
                .setSubject(userId)
                .setExpiration(new Date(System.currentTimeMillis()
                        + Long.parseLong(env.getProperty("access-token.expiration_time"))))
                .signWith(keyForAccessToken, SignatureAlgorithm.HS512)
                .compact();
    }

    public String createRefreshToken(String userId)
    {
        byte[] refreshTokenSecretBytes = DatatypeConverter.parseBase64Binary(env.getProperty("refresh-token.secret"));
        Key keyForRefreshToken = new SecretKeySpec(refreshTokenSecretBytes, SignatureAlgorithm.HS512.getJcaName());

        return Jwts.builder()
                .setSubject(userId)
                .setExpiration(new Date(System.currentTimeMillis()
                        + Long.parseLong(env.getProperty("refresh-token.expiration_time"))))
                .signWith(keyForRefreshToken, SignatureAlgorithm.HS512)
                .compact();
    }
}
