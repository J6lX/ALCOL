package com.alcol.logservice.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "battle_log_tb")
public class BattleLogEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long battleLogNo;

    @JsonManagedReference
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
