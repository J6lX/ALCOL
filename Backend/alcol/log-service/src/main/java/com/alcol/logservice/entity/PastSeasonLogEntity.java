package com.alcol.logservice.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "past_season_log_tb")
public class PastSeasonLogEntity
{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long pastSeasonLogNo;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String battleMode;

    @Column(nullable = false)
    private String season;

    @Column(nullable = false)
    private String tier;

    @Column(nullable = false)
    private int ranking;

    @Column(nullable = false)
    private int winCnt;

    @Column(nullable = false)
    private int loseCnt;
}
