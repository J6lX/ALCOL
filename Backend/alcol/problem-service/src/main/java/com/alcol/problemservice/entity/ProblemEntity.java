package com.alcol.problemservice.entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Getter
@Table(name = "problem_tb")
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProblemEntity
{
    @Id
    @Column(name = "prob_no")
    private Long probNo;

    @ManyToOne
    @JoinColumn(name = "tier")
    private ProblemTierEntity tier;

    //문제랑 문제유형 1:N
    @OneToMany(mappedBy = "problemEntity")
    private List<ProblemCategoryConnectEntity> problemCategoryConnectEntityList = new ArrayList<>();

    @Column(nullable = false, name = "prob_name")
    private String probName;

    @Column(nullable = false, name = "prob_detail_desc")
    private String probDetailDesc;

    @Column(nullable = false, name = "prob_input_desc")
    private String probInputDesc;

    @Column(nullable = false, name = "prob_output_desc")
    private String probOutputDesc;

    @Column(nullable = false, name = "prob_time_limit")
    private int probTimeLimit;

    @Column(nullable = false, name = "prob_memory_limit")
    private int probMemoryLimit;

    @Column(nullable = false, name = "prob_test_input")
    private String probTestInput;

    @Column(nullable = false, name = "prob_test_output")
    private String probTestOutput;

    @Column(nullable = false, name = "prob_score_input")
    private String probScoreInput;

    @Column(nullable = false, name = "prob_score_output")
    private String probScoreOutput;

    @Column(nullable = false, name = "prob_create_time")
    private LocalDateTime probCreateTime;
}
