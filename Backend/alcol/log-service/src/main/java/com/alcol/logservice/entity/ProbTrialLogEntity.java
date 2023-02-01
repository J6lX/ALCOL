package com.alcol.logservice.entity;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "prob_trial_log_tb")
public class ProbTrialLogEntity
{
    @Id
    private Long probTrialLogNo;

    @Column(nullable = false, unique = true)
    private String userId;

    @Column(nullable = false)
    private int probNo;

    @Column(nullable = false)
    private int isCorrect;

    @Column(nullable = false)
    private int addExp;

    @Column(nullable = false)
    private int curExp;

    @Column(nullable = false)
    private LocalDateTime submitTime;
}
