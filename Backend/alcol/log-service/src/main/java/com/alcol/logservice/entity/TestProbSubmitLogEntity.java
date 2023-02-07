package com.alcol.logservice.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "test_prob_submit_log_tb")
public class TestProbSubmitLogEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long probTrialLogNo;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private Long probNo;

    @Column(nullable = false)
    private int isCorrect;

    @Column(nullable = false)
    private LocalDateTime submitTime;
}
