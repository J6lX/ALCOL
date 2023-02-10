package com.alcol.problemservice.entity;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Getter
@Table(name = "prob_tier_pivot_tb")
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProblemTierEntity {
    @Id
    String tier;
    @Column(name = "tier_exp")
    int tierExp;
}
