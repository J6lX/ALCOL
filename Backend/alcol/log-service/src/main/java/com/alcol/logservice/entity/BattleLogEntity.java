package com.alcol.logservice.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "battle_log_tb")
public class BattleLogEntity
{
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long battleLogNo;

    @OneToMany(mappedBy = "battleLogEntity", cascade = CascadeType.ALL)
    private Set<BattleProbSubmitLogEntity> battleProbSubmitLogEntityList = new LinkedHashSet<>();

    public void addBattleProbSubmitLogEntity(BattleProbSubmitLogEntity battleProbSubmitLogEntity)
    {
        battleProbSubmitLogEntityList.add(battleProbSubmitLogEntity);
        battleProbSubmitLogEntity.setBattleLogEntity(this);
    }

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
