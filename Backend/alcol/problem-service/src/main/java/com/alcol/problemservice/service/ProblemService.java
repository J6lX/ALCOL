package com.alcol.problemservice.service;

import com.alcol.problemservice.dto.ProblemDto;

import java.util.List;

public interface ProblemService
{
    List<ProblemDto.ProbDetailDto> getProbDetailList(List<String> probNoList);
}
