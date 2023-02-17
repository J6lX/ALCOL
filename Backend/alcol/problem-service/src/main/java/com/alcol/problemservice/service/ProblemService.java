package com.alcol.problemservice.service;

import com.alcol.problemservice.dto.ProblemDto;
import com.alcol.problemservice.dto.ScoreDto;

import java.util.List;

public interface ProblemService
{
    List<ProblemDto.ProbNameTierDto> getProbNameTier(List<String> probNoList);
    ProblemDto.ProbDetail getProbDetail(Long probNo);
    List<ProblemDto.ProbList> getAllProbList();
    List<ProblemDto.ThreeProb> getThreeProbList(int mmr);
    String getSubmissionId(ScoreDto.Request problem);
    ScoreDto.Response getScoreResult(String submissionId);
    boolean recordLevelExp(String userId);

}
