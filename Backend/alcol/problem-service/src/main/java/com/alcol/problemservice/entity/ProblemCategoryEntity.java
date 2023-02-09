package com.alcol.problemservice.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class ProblemCategoryEntity {
    @Id
    String categoryName;
}
