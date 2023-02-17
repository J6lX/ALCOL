package com.alcol.userservice.entity;

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
    private int level;

    @Column(nullable = false)
    private int needExp;

    @Column(nullable = false)
    private int sumExp;
}
