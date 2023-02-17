package com.alcol.logservice.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "battle_prob_submit_log_tb")
public class BattleProbSubmitLogEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int battleProbSubmitLogNo;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "battle_log_no", nullable = false)
    private BattleLogEntity battleLogEntity;

    @Column(nullable = false)
    private int isCorrect;

    @Column(nullable = false)
    private int probRunningTime;

    @Column(nullable = false)
    private int probRunningMemory;

    @Column(nullable = false)
    private LocalDateTime submitTime;
}
