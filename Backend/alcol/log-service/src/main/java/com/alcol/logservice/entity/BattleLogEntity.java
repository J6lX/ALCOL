package com.alcol.logservice.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "battle_log_tb")
public class BattleLogEntity
{
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long battleLogNo;

    @Column(nullable = false)
    private String myUserId;

    @Column(nullable = false)
    private String otherUserId;

    @Column(nullable = false)
    private String battleMode;

    @Column(nullable = false)
    private Long probNo;

    @Column(nullable = false)
    private int battleResult;

    @Column(nullable = false)
    private int upDownMmr;

    @Column(nullable = false)
    private int nowMmr;

    @Column(nullable = false)
    private LocalDateTime endTime;
}