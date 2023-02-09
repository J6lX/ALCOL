package com.alcol.problemservice.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class ProblemTierEntity {
    @Id
    String tier;
}
