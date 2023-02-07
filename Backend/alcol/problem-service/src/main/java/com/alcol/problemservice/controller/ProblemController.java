package com.alcol.problemservice.controller;

import com.alcol.problemservice.dto.ProblemDto;
import com.alcol.problemservice.service.ProblemService;
import com.alcol.problemservice.util.RestTemplateUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
    @PostMapping("/getProbDetail")
    public ResponseEntity<List<ProblemDto.ProbDetailDto>> getProbDetail(
            @RequestParam(value = "prob_no_list") List<String> probNoList
    )
    {
        log.info("ProblemController 의 getProbDetail 메소드 실행");
        List<ProblemDto.ProbDetailDto> list = problemService.getProbDetailList(probNoList);
        return restTemplateUtils.sendResponse(list);
    }
}
