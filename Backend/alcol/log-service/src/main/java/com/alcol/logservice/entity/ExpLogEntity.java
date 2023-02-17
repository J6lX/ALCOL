package com.alcol.logservice.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "exp_log_tb")
public class ExpLogEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long expLogNo;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private int addExp;

    @Column(nullable = false)
    private int curExp;
}
