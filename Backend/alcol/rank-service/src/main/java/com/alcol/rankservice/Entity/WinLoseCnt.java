package com.alcol.rankservice.entity;

import lombok.Builder;
import lombok.Getter;

import javax.persistence.Entity;
import javax.persistence.Id;

@Getter
@Builder
public class WinLoseCnt
{
    @Id
    private String id;
    private String mode;

}
