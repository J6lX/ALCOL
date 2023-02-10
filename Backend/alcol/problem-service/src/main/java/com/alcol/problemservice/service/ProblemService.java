package com.alcol.problemservice.service;

import com.alcol.problemservice.dto.ProblemDto;

import java.util.List;

public interface ProblemService
{
    List<ProblemDto.ProbNameTierDto> getProbNameTier(List<String> probNoList);
    ProblemDto.ProbDetail getProbDetail(Long probNo);
    List<ProblemDto.ProbList> getAllProbList();
}
