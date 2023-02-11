package com.alcol.problemservice.service;

import com.alcol.problemservice.dto.ProblemDto;
import com.alcol.problemservice.entity.ProblemCategoryConnectEntity;
import com.alcol.problemservice.entity.ProblemEntity;
import com.alcol.problemservice.repository.ProblemRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class ProblemServiceImpl implements ProblemService
{
    private final ProblemRepository problemRepository;

    public ProblemServiceImpl(ProblemRepository problemRepository)
    {
        this.problemRepository = problemRepository;
    }

    /**
     * 문제 번호 리스트를 받아서 문제 상세 정보(문제 이름, 문제 티어) 리스트를 반환
     *
     * @param probNoList
     * @return List<ProblemDto.ProbNameTierDto>
     */
    @Override
    public List<ProblemDto.ProbNameTierDto> getProbNameTier(List<String> probNoList)
    {
        List<ProblemDto.ProbNameTierDto> list = new ArrayList<>();

        for (String probNo : probNoList)
        {
            probNo = probNo.replaceAll("\\[|\\]", "");
            ProblemEntity problemEntity = problemRepository.findByProbNo(Long.parseLong(probNo));
            ProblemDto.ProbNameTierDto probDetailDto = ProblemDto.ProbNameTierDto.builder()
                    .prob_no(problemEntity.getProbNo())
                    .prob_name(problemEntity.getProbName())
                    .prob_tier(problemEntity.getTier().getTier())
                    .build();
            list.add(probDetailDto);
        }

        return list;
    }

    public ProblemDto.ProbDetail getProbDetail(Long probNo)
    {
        ProblemEntity problemEntity = problemRepository.findById(probNo).orElse(null);


        return ProblemDto.ProbDetail.builder()
                .prob_no(problemEntity.getProbNo())
                .prob_name(problemEntity.getProbName())
                .prob_content(problemEntity.getProbDetailDesc())
                .prob_input_content(problemEntity.getProbInputDesc())
                .prob_output_content(problemEntity.getProbOutputDesc())
                .prob_time_limit(problemEntity.getProbTimeLimit())
                .prob_memory_limit(problemEntity.getProbMemoryLimit())
                .prob_input_testcase(problemEntity.getProbTestInput())
                .prob_output_testcase(problemEntity.getProbTestOutput())
                .prob_tier(problemEntity.getTier().getTier())
                .build();
    }

    public List<ProblemDto.ProbList> getAllProbList()
    {
        Iterable<ProblemEntity> problemList = problemRepository.findAll();
        List<ProblemDto.ProbList> allProbList = new ArrayList<>();
        for(ProblemEntity prob : problemList)
        {
            List<String> categoryList = new ArrayList<>();
            List<ProblemCategoryConnectEntity> probConnect = prob.getProblemCategoryConnectEntityList();
            for(ProblemCategoryConnectEntity probConnectEntity : probConnect)
                categoryList.add(probConnectEntity.getProblemCategoryEntity().getCategoryName());

            allProbList.add(ProblemDto.ProbList.builder()
                            .prob_no(prob.getProbNo())
                            .prob_name(prob.getProbName())
                            .prob_category(categoryList)
                            .prob_tier(prob.getTier().getTier())
                    .build());
        }

        return allProbList;
    }
}
