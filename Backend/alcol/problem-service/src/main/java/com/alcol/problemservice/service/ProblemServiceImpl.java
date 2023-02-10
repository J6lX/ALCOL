package com.alcol.problemservice.service;

import com.alcol.problemservice.dto.ProblemDto;
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
     * @param probNoList
     * @return List<ProblemDto.ProbDetailDto>
     */
    @Override
    public List<ProblemDto.ProbDetailDto> getProbDetailList(List<String> probNoList)
    {
        List<ProblemDto.ProbDetailDto> list = new ArrayList<>();

//        for (String probNo : probNoList)
//        {
//            probNo = probNo.replaceAll("\\[|\\]", "");
//            ProblemEntity problemEntity = problemRepository.findByProbNo(Long.parseLong(probNo));
//            ProblemDto.ProbDetailDto probDetailDto = ProblemDto.ProbDetailDto.builder()
//                    .probNo(problemEntity.getProbNo())
//                    .probName(problemEntity.getProbName())
//                    .probTier(problemEntity.getTier())
//                    .build();
//            list.add(probDetailDto);
//        }

        return list;
    }
}
