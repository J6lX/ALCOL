package com.alcol.problemservice.controller;

import com.alcol.problemservice.dto.ProblemDto;
import com.alcol.problemservice.dto.ScoreDto;
import com.alcol.problemservice.error.CustomStatusCode;
import com.alcol.problemservice.service.ProblemService;
import com.alcol.problemservice.util.ApiUtils;
import com.alcol.problemservice.util.RestTemplateUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequestMapping("/problem-service")
@CrossOrigin(origins = "*", allowedHeaders = "*")
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

    /**
     * 문제의 디테일한 내용 요청
     * @param probNum
     * @return Problem Detail
     */

    @GetMapping("/getProblemDetail/{probNum}")
    public ResponseEntity<ProblemDto.ProbDetail> getProbDetail(@PathVariable("probNum") Long probNum)
    {
        ProblemDto.ProbDetail probDetail = problemService.getProbDetail(probNum);

        log.info("probDetail_input_testcase : " + probDetail.getProb_input_testcase());
        log.info("probDetail_output_testcase : " + probDetail.getProb_output_testcase());

        return ResponseEntity.status(HttpStatus.OK).body(probDetail);
    }

    /**
     * 연습문제 페이지에 들어갔을 때 문제 리스트 요청
     * @return Problem List
     */

    @GetMapping("/problemList")
    public ResponseEntity<List<ProblemDto.ProbList>> getAllProbList()
    {
        return ResponseEntity.status(HttpStatus.OK).body(problemService.getAllProbList());
    }


    /**
     * 문제 채점 요청
     * @param req
     * @return ScoreDto.ResponseDto<?>
     */
    @PostMapping("/practiceSubmit")
    public ResponseEntity<ScoreDto.ResponseDto<?>> getScoreResult(@RequestBody ScoreDto.Request req, @RequestHeader Map<String, String> header)
    {
        // 정답을 제출한 후 submission id를 요청한다.
        String submissionId = problemService.getSubmissionId(req);
        // submission id를 받아올 수 없다면 에러처리한다.
        if(submissionId == null)
        {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiUtils.error(CustomStatusCode.SCORE_SUBMISSION_ERROR));
        }

        // 코드를 채점하는 시간이 있으므로 5초 뒤에 요청한다.
        try {
            Thread.sleep(4000);
        }
        catch (InterruptedException e)
        {
            e.printStackTrace();
        }

        // submission id로 제출 결과를 가져온다.
        ScoreDto.Response response = problemService.getScoreResult(submissionId);
        // 제출 결과를 받아올 수 없다면 에러처리한다.
        if(response == null)
        {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiUtils.error(CustomStatusCode.SCORE_RESULT_ERROR));
        }
        // 컴파일 에러일 때 에러 메시지를 보낸다.
        if(response.getResult().equals("CompileError"))
        {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiUtils.error(CustomStatusCode.SCORE_COMPILE_ERROR));
        }

        // 정답을 맞혔을 경우 levelExp를 log-service로 보낸다.
        if(response.getResult().equals("success"))
        {
            if(problemService.recordLevelExp(header.get("user_id")))
            {
                log.info("맞힌 정답 기록 log-service로 전달 완료");
            }
            else
            {
                log.error("log-service로 전달되지 않음");
            }
        }

        return ResponseEntity.status(HttpStatus.OK).body(ApiUtils.success(response, CustomStatusCode.SCORE_SUCCESS));
    }
}