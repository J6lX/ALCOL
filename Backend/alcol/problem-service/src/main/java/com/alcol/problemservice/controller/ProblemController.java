package com.alcol.problemservice.controller;

import com.alcol.problemservice.dto.ProblemDto;
import com.alcol.problemservice.service.ProblemService;
import com.alcol.problemservice.util.RestTemplateUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@Slf4j
@RequestMapping("/problem-service")
public class ProblemController
{
    private final ProblemService problemService;
    private final RestTemplateUtils restTemplateUtils;

    public ProblemController(ProblemService problemService, RestTemplateUtils restTemplateUtils)
    {
        this.problemService = problemService;
        this.restTemplateUtils = restTemplateUtils;
    }

    /**
     * @param probNoList
     * @return ResponseEntity<List<ProblemDto.ProbDetailDto>>
     */
    @PostMapping("/getProbSubjectAndTier")
    public ResponseEntity<List<ProblemDto.ProbNameTierDto>> getNameTier(
            @RequestParam(value = "prob_no_list") List<String> probNoList)
    {
        log.info("ProblemController 의 getProbDetail 메소드 실행");
        List<ProblemDto.ProbNameTierDto> list = problemService.getProbNameTier(probNoList);
        return restTemplateUtils.sendResponse(list);
    }

    /**
     * 배틀에서 문제 3개 요청
     * @param mmr
     * @return List<ProblemDto.ThreeProb>
     */
    @GetMapping("/getThreeProblem")
    public ResponseEntity<List<ProblemDto.ThreeProb>> getThreeProblems(@RequestParam int mmr)
    {
        List<ProblemDto.ThreeProb> threeProbs = problemService.getThreeProbList(mmr);

        return ResponseEntity.status(HttpStatus.OK).body(threeProbs);
    }

    @GetMapping("/getProblemDetail/{probNum}")
    public ResponseEntity<ProblemDto.ProbDetail> getProbDetail(@PathVariable("probNum") Long probNum)
    {
        return ResponseEntity.status(HttpStatus.OK).body(problemService.getProbDetail(probNum));
    }

    @GetMapping("/problemList")
    public ResponseEntity<List<ProblemDto.ProbList>> getAllProbList()
    {
        return ResponseEntity.status(HttpStatus.OK).body(problemService.getAllProbList());
    }
}
