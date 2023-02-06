package com.alcol.userservice.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user_tb")
public class UserEntity
{
    @Id
    private String userId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String encryptedPwd;

    @Column(nullable = false, unique = true)
    private String nickname;

    private String originalFileName;

    private String storedFileName;

    private long fileSize;

    private LocalDateTime createdAt;
}
