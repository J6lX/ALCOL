package com.alcol.problemservice.controller;

import com.alcol.problemservice.dto.Cate;
import com.alcol.problemservice.dto.ProblemDto;
import com.alcol.problemservice.dto.Wait;
import com.alcol.problemservice.service.ProblemService;
import com.alcol.problemservice.util.RestTemplateUtils;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @GetMapping("/getThreeProblem")
    public ResponseEntity<List<Wait>> example(@RequestParam int mmr)
    {
        List<Wait> list = new ArrayList<>();
        List<String> cate = new ArrayList<>();
        cate.add("dfs");
        cate.add("dddd");
        cate.add("aaaa");

        List<String> cate1 = new ArrayList<>();
        cate1.add("안뇽");
        cate1.add("댜쟈");
        cate1.add("비타민조하");

        List<String> cate2 = new ArrayList<>();
        cate2.add("히힛");
        cate2.add("화이땡!!");
        cate2.add("유유유형");

        Wait wait1 = new Wait(1, cate);
        Wait wait2 = new Wait(2, cate1);
        Wait wait3 = new Wait(3, cate2);


        list.add(wait1);
        list.add(wait2);
        list.add(wait3);


        return ResponseEntity.status(HttpStatus.OK).body(list);
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
