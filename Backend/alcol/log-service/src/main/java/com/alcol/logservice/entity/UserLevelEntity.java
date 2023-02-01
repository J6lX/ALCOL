package com.alcol.logservice.entity;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "user_level_tb")
public class UserLevelEntity
{
    @Id
    private String tier;

    @Column(nullable = false)
    private int minMmr;

    @Column(nullable = false)
    private int maxMmr;
}
