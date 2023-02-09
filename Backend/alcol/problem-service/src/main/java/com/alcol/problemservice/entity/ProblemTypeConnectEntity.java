package com.alcol.problemservice.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "prob_category_pivot_tb")
public class ProblemTypeConnectEntity {
    @Id
    int probCategoryPivotNumber;

}