package com.alcol.userservice.jpa;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@Entity
@Table(name = "user_tb")
public class UserEntity {
    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String userId;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false, unique = true)
    private String encryptedPwd;
    @Column(nullable = false, unique = true)
    private String nickname;
    private String image;

    private LocalDateTime createdAt;
}
