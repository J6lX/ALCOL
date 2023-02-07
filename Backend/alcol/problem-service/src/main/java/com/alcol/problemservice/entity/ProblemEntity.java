package com.alcol.problemservice.entity;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "problem_tb")
public class ProblemEntity
{
    @Id
    private Long probNo;

    @Column(nullable = false)
    private String tier;

    @Column(nullable = false)
    private String probName;

    @Column(nullable = false)
    private String probDetailDesc;

    @Column(nullable = false)
    private String probInputDesc;

    @Column(nullable = false)
    private String probOutputDesc;

    @Column(nullable = false)
    private int probTimeLimit;

    @Column(nullable = false)
    private int probMemoryLimit;

    @Column(nullable = false)
    private String probTestInput;

    @Column(nullable = false)
    private String probTestOutput;

    @Column(nullable = false)
    private String probScoreInput;

    @Column(nullable = false)
    private String probScoreOutput;

    @Column(nullable = false)
    private LocalDateTime probCreateTime;
}
