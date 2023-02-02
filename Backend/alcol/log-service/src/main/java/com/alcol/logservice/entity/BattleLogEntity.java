package com.alcol.logservice.entity;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "battle_log_tb")
public class BattleLogEntity
{
    @Id
    private Long battleLogNo;

    @Column(nullable = false)
    private String myUserId;

    @Column(nullable = false)
    private String otherUserId;

    @Column(nullable = false)
    private String battleMode;

    @Column(nullable = false)
    private int probNo;

    @Column(nullable = false)
    private int battleResult;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false)
    private int upDownMmr;

    @Column(nullable = false)
    private int nowMmr;
}
