package com.alcol.problemservice.entity;

import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "prob_tier_tb")
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProblemTierEntity {
    @Id
    private String tier;

    @Column(name = "tier_exp")
    private int tierExp;

    @OneToMany(mappedBy = "tier")
    private List<ProblemEntity> problemEntityList = new ArrayList<>();
}
