package com.alcol.problemservice.service;

import com.alcol.problemservice.dto.ProblemDto;
import com.alcol.problemservice.entity.ProblemCategoryConnectEntity;
import com.alcol.problemservice.entity.ProblemEntity;
import com.alcol.problemservice.entity.ProblemTierEntity;
import com.alcol.problemservice.repository.ProblemRepository;
import com.alcol.problemservice.repository.TestRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProblemServiceImpl implements ProblemService
{
    private final ProblemRepository problemRepository;
    private final TestRepo t;
    private final RestTemplate restTemplate;

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

    public List<ProblemDto.ThreeProb> getThreeProbList(int mmr) {
        // 해당 mmr의 티어가 무엇인지 가져온다.
        String url = "http://i8b303.p.ssafy.io:8000/user-service/getTier/" + mmr;
        String tier =  restTemplate.getForObject(url, String.class);

        // 티어에 해당하는 문제 가져오기

        // 여기 t가 임시로 만든 testRepository
        System.out.println(t.findAllByTier(tier).get(0).getProbName());


return null;

    }
}
