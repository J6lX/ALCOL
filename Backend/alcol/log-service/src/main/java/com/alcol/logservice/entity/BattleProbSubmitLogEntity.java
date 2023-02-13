package com.alcol.logservice.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "battle_prob_submit_log_tb")
public class BattleProbSubmitLogEntity
{
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private int battleProbSubmitLogNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "battle_log_no", nullable = false)
    private BattleLogEntity battleLogEntity;

//    @Column(nullable = false)
//    private int battleLogNo;

    @Column(nullable = false)
    private int isCorrect;

    @Column(nullable = false)
    private int probRunningTime;

    @Column(nullable = false)
    private int probRunningMemory;

    @Column(nullable = false)
    private LocalDateTime submitTime;
}
