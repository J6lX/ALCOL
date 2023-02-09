package com.alcol.problemservice.entity;

import javax.persistence.*;

@Entity
@Table(name = "prob_category_pivot_tb")
public class ProblemTypeConnectEntity {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    int probCategoryPivotNumber;

    int problemNumber;
    String categoryName;
}