package com.alcol.userservice.entity;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "user_tier_tb")
public class UserTierEntity
{
    @Id
    private String tier;

    @Column(nullable = false)
    private int minMmr;

    @Column(nullable = false)
    private int maxMmr;
}
