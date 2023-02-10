package com.alcol.problemservice.entity;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "prob_category_pivot_tb")
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProblemCategoryConnectEntity {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private int probCategoryPivotNumber;
    @ManyToOne
    @JoinColumn(name = "prob_no")
    private ProblemEntity problemEntity;

    @ManyToOne
    @JoinColumn(name = "category_name")
    private ProblemCategoryEntity problemCategoryEntity;
}