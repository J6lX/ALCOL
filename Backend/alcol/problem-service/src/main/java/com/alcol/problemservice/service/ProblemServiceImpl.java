package com.alcol.problemservice.service;

import com.alcol.problemservice.dto.ProblemDto;
import com.alcol.problemservice.dto.ScoreDto;
import com.alcol.problemservice.entity.ProblemCategoryConnectEntity;
import com.alcol.problemservice.entity.ProblemEntity;
import com.alcol.problemservice.entity.ProblemTierEntity;
import com.alcol.problemservice.repository.ProblemRepository;
import com.alcol.problemservice.repository.TierRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.json.simple.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.net.ssl.SSLContext;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProblemServiceImpl implements ProblemService
{
    private final ProblemRepository problemRepository;
    private final TierRepository tierRepository;
    private final RestTemplate restTemplate;
    private RestTemplate restTemplateForHttps;

    {
        try {
            restTemplateForHttps = this.makeRestTemplate();
        } catch (KeyStoreException e) {
            throw new RuntimeException(e);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        } catch (KeyManagementException e) {
            throw new RuntimeException(e);
        }
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

    /**
     * 문제 디테일 정보 반환 (연습문제, 배틀문제)
     * @param probNo
     * @return Problem Detail
     */
    public ProblemDto.ProbDetail getProbDetail(Long probNo)
    {
        ProblemEntity problemEntity = problemRepository.findById(probNo).orElse(null);

        String probDetailDesc = problemEntity.getProbDetailDesc();
        String probInputDesc = problemEntity.getProbInputDesc();
        String probOutputDesc = problemEntity.getProbOutputDesc();
        String probTestInput = problemEntity.getProbTestInput();
        String probTestOutput = problemEntity.getProbTestOutput();

        return ProblemDto.ProbDetail.builder()
                .prob_no(problemEntity.getProbNo())
                .prob_name(problemEntity.getProbName())
                .prob_content(probDetailDesc)
                .prob_input_content(probInputDesc)
                .prob_output_content(probOutputDesc)
                .prob_time_limit(problemEntity.getProbTimeLimit())
                .prob_memory_limit(problemEntity.getProbMemoryLimit())
                .prob_input_testcase(probTestInput)
                .prob_output_testcase(probTestOutput)
                .prob_tier(problemEntity.getTier().getTier())
                .build();
    }

    /**
     * 모든 문제 리스트 반환 (연습문제)
     * @return Problem List
     */
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

    /**
     * 배틀에서 세 문제 골라주기
     * @param mmr
     * @return Three Problem List
     */
    public List<ProblemDto.ThreeProb> getThreeProbList(int mmr)
    {
        List<ProblemDto.ThreeProb> threeProbList = new ArrayList<>();

        // 해당 mmr의 티어가 무엇인지 가져온다.
        String url = "http://i8b303.p.ssafy.io:8000/user-service/getTier/" + mmr;
        String tier =  restTemplate.getForObject(url, String.class);

        List<ProblemEntity> problemEntityList = new ArrayList<>();
        // 티어에 해당하는 문제 가져오기
        try
        {
            ProblemTierEntity problemTierEntity = tierRepository.findByTier(tier);
            problemEntityList = problemTierEntity.getProblemEntityList();
        }
        catch (Exception e)
        {
            log.error("티어에 해당하는 문제를 가져오는 과정에서 문제 발생");
            return null;
        }

        // 세 문제 랜덤으로 뽑기
        int cnt = 0;
        int size = problemEntityList.size();
        boolean[] check = new boolean[size+1];

        // 문제가 없을 경우 null을 리턴한다.
        if(size == 0) return null;

        while(cnt < 3)
        {
            Random random = new Random();
            int num = random.nextInt(size);
            // 중복된 문제는 선택하지 않는다.
            if(check[num]) continue;
            check[num] = true;

            ProblemEntity selectedProb = problemEntityList.get(num);
            List<ProblemCategoryConnectEntity> category = selectedProb.getProblemCategoryConnectEntityList();

            List<String> categoryList = new ArrayList<>();
            for(int i=0; i<category.size(); i++)
            {
                categoryList.add(category.get(i).getProblemCategoryEntity().getCategoryName());
            }
            cnt++;

            threeProbList.add(ProblemDto.ThreeProb.builder()
                    .prob_no(selectedProb.getProbNo())
                    .prob_category(categoryList)
                    .build());
        }

        return threeProbList;
    }

    /**
     * 제출 아이디 반환
     * @param problem
     * @return submission Id
     */

    public String getSubmissionId(ScoreDto.Request problem)
    {
        String submissionId;

        // 채점 서버에 채점을 요청해 submisson_id를 받아옴
        try
        {
            String url = "https://i8b303.p.ssafy.io:1443/api/submission";
            HttpHeaders header = new HttpHeaders();
            header.add("Cookie", "sessionid=lkftsz50s6aejyb4pdkz56kqksgl47nb");
            HttpEntity<ScoreDto.Request> requestHttpEntity = new HttpEntity<>(problem, header);
            ScoreDto.getSubmissionErrorData getSubmissionData = restTemplateForHttps.postForObject(url, requestHttpEntity, ScoreDto.getSubmissionErrorData.class);

            submissionId = getSubmissionData.getData().getSubmission_id();
        }
        catch (Exception e)
        {
            log.error("채점 서버에 채점을 요청하는 과정에서 오류 발생");
            return null;
        }

        return submissionId;
    }

    /**
     * 받은 제출 아이디로 채점 결과 반환
     * @param submissionId
     * @return 채점결과
     */

    public ScoreDto.Response getScoreResult(String submissionId)
    {
        int round = 3; // 최대 3번만 요청한다.
        while(round --> 0) {
            // submission id로 채점 결과를 가져온다.
            ResponseEntity<JSONObject> response;
            try {
                String url = "https://i8b303.p.ssafy.io:1443/api/submission?id=" + submissionId;
                HttpHeaders header = new HttpHeaders();
                header.add("Cookie", "sessionid=lkftsz50s6aejyb4pdkz56kqksgl47nb");
                HttpEntity request = new HttpEntity(header);

                response = restTemplateForHttps.exchange(url, HttpMethod.GET, request, JSONObject.class);
            } catch (Exception e) {
                log.error("채점 결과를 받아오는 것에서 오류 발생");
                return null;
            }

            HashMap<String, Object> submissionData = (HashMap<String, Object>) response.getBody().get("data");

            // 채점 결과가 0이면 맞은거고 나머지는 틀린거임
            int result = (int) submissionData.get("result");

            // 채점 결과가 6이나 7이면 채점이 진행되고 있다는 뜻이므로 정보를 다시 요청한다.
            if (result == 6 || result == 7) {
                // 3초 뒤에 다시 요청한다.
                try {
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                    log.error("코드 채점 3초 뒤에 다시 결과를 가져오는 과정에서 오류 발생");
                }
                continue;
            }

            HashMap<String, Object> InfoData = (HashMap<String, Object>) submissionData.get("info");
            // 테스트케이스 리스트
            List<HashMap<String, Object>> testcaseList = (List<HashMap<String, Object>>) InfoData.get("data");

            if(testcaseList == null)
            {
                return ScoreDto.Response.builder()
                        .result("CompileError")
                        .build();
            }
            // 전체 테스트케이스 개수
            int allTestcaseCnt = testcaseList.size();
            // 맞은 테스트케이스 개수
            int successTestcaseCnt = testcaseList.size();

            // 시간, 메모리 복잡도가 들은 statistic_info 뽑기
            HashMap<String, Object> statisticInfoData = (HashMap<String, Object>) submissionData.get("statistic_info");
            int time = -1;
            int memory = -1;

            // 정답이 맞았을 경우
            if (result == 0) {
                time = (int) statisticInfoData.get("time_cost");
                memory = (int) statisticInfoData.get("memory_cost");
            }
            // 틀렸을 경우
            else {
                int success = 0;
                // 테스트케이스 리스트를 돌면서 맞았는지 확인한다.
                for (int i = 0; i < allTestcaseCnt; i++) {
                    if ((int) testcaseList.get(i).get("result") == 0) {
                        success += 1;
                    }
                }

                successTestcaseCnt = success;
            }

            String resultToString = result == 0 ? "success" : "fail";

            return ScoreDto.Response.builder()
                    .result(resultToString)
                    .all_testcase_cnt(allTestcaseCnt)
                    .success_testcase_cnt(successTestcaseCnt)
                    .time(time)
                    .memory(memory / 1024)
                    .build();
        }
        return null;
    }

    /**
     * 문제를 풀어서 맞았을 때 log-service로 보내서 levelExp를 올린다.
     * levelExp를 올리고 
     * @param userId
     * @return boolean
     */
    public boolean recordLevelExp(String userId)
    {
        String url = "http://i8b303.p.ssafy.io:9005/log-service/insertExp";

        Map<String, String> map = new HashMap<>();
        map.put("user_id", userId);
        map.put("add_exp", "75");

        int response = restTemplate.postForObject(url, map, Integer.class);
        if(response == 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    /**
     * https에 요청할 때 사용할 restTemplate 설정
     * @throws KeyStoreException
     * @throws NoSuchAlgorithmException
     * @throws KeyManagementException
     */
    private RestTemplate makeRestTemplate() throws KeyStoreException, NoSuchAlgorithmException, KeyManagementException {

        TrustStrategy acceptingTrustStrategy = (X509Certificate[] chain, String authType) -> true;

        SSLContext sslContext = org.apache.http.ssl.SSLContexts.custom()
                .loadTrustMaterial(null, acceptingTrustStrategy)
                .build();

        SSLConnectionSocketFactory csf = new SSLConnectionSocketFactory(sslContext, new NoopHostnameVerifier());

        CloseableHttpClient httpClient = HttpClients.custom()
                .setSSLSocketFactory(csf)
                .build();

        HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
        requestFactory.setHttpClient(httpClient);

        requestFactory.setConnectTimeout(3 * 1000);

        requestFactory.setReadTimeout(3 * 1000);

        return new RestTemplate(requestFactory);
    }

}
