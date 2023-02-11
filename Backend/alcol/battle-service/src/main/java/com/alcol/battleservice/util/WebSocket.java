package com.alcol.battleservice.util;

import com.alcol.battleservice.config.ServerEndpointConfigurator;
import com.alcol.battleservice.dto.ResponseDataDTO;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.http.*;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import javax.net.ssl.SSLContext;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;
import java.time.Duration;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Component
@ServerEndpoint(value="/websocket", configurator = ServerEndpointConfigurator.class)
public class WebSocket {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private RestTemplate restTemplate;

    private RestTemplate restTemplateForHttps = this.makeRestTemplate();
    private ZSetOperations<String, Object> ranking;
    private int userMmr;
    private int otherMmr;
    int mmrAvg;
    private static Set<String> sessionSet = new HashSet<String>();
    private static Map<String, Session> sessionMap = new HashMap<>();
    private static Map<String, BattleRoom> sessionId2Obj = new HashMap<>();
    private static Map<String, Session> userId2Session = new HashMap<>();
    private static Map<String, String> userId2SessionId = new HashMap<>();
    private static Map<Session, String> session2UserId = new HashMap<>();
    private static Map<String, User> userMap = new HashMap<>();
    private static Set<String> userSet = new HashSet<String>();
    private static Map<String, LocalTime> refreshMap = new HashMap<>();
//    private static Map<String, Room> roomMap = new HashMap<>();

    static Random random = new Random();
    static boolean runCheck = false;

    public WebSocket() throws KeyStoreException, NoSuchAlgorithmException, KeyManagementException {
    }

    @OnOpen
    public void handleOpen(Session session) {
        if (session != null) {
            String sessionId = session.getId();
            sessionSet.add(sessionId);
            sessionMap.put(sessionId, session);
            System.out.println("이것은 세션 아이디이다."+sessionId);
            printInfo();

            if (!runCheck) {
                TimerTask task = new TimerTask() {
                    @Override
                    public void run() {
                    }
                };
                runCheck = true;
                Timer timer = new Timer(true);
                timer.scheduleAtFixedRate(task, 0, 15000);

            }
            ;
        }
    }


    /**
     * 웹소켓 메시지(From Client) 수신하는 경우 호출
     */
    @OnMessage
    public void handleMessage(String jsonMessage, Session session) throws ParseException, IOException, URISyntaxException {
        if (session != null)
        {
            JSONParser parser = new JSONParser();
            JSONObject obj = (JSONObject) parser.parse(jsonMessage);
            System.out.println(jsonMessage);
            String method = obj.get("messageType").toString();
            Object object = null;
            // 처음 입장할 때
            if (method.equals("connect"))
            {

                String userId = obj.get("userId").toString();
                String otherUserId = obj.get("otherId").toString();
                String battleMode = obj.get("battleMode").toString();
                String hostCheck = obj.get("hostCheck").toString();
                ranking = redisTemplate.opsForZSet();
                try
                {
                    userMmr = ranking.score(battleMode, userId).intValue();
                    otherMmr = ranking.score(battleMode,otherUserId).intValue();
                    mmrAvg = (userMmr+otherMmr)/2;
                }

                catch (Exception e)
                {
                    MultiValueMap<String, String> bodyData = new LinkedMultiValueMap<>();
                    bodyData.add("user_id",userId);
                    bodyData.add("mode",battleMode);
                }
                System.out.println("this is restTempalte : "+ restTemplate);



                User user = User.builder().session(session).userId(userId).prevMmr(userMmr).battleMode(battleMode).build();
                if(hostCheck.equals("false"))
                {
                    while(true)
                    {
                        if(sessionMap.containsKey(otherUserId))
                        {
                            sessionId2Obj.get(otherUserId).user2 = user;
                            userId2Session.put(userId, session);
                            session2UserId.put(session, userId);
                            userId2SessionId.put(userId, otherUserId);
                            System.out.println("이미 만들어져 있음 : "+ sessionMap.get(otherUserId).getId());
                            JSONObject data = new JSONObject();
                            data.put("messageType","connect_success");

                            synchronized (session) {
                                userId2Session.get(otherUserId).getAsyncRemote().sendText(data.toJSONString());
//                                session.getAsyncRemote().sendText(data.toJSONString());
                            }
                            break;
                        }
                        else {
                            try
                            {
                                Thread.sleep(500);
                            }catch (InterruptedException e)
                            {
                                e.printStackTrace();
                            }
                        }
                    }
//                    session.getAsyncRemote().sendText("connect_success");
//                    String url = "http://i8b303.p.ssafy.io:9005/problem-service/getLevelAndTier";
//                    ResponseEntity<List> problems = restTemplate.getForEntity(url,List.class);
//                    System.out.println(problems);
                }
                else
                {
//                    User user = User.builder().session(session).userId(userId).prevMmr(mmr).build();
                    BattleRoom battleRoom = BattleRoom.builder().user1(user).build();
                    sessionMap.put(userId, session);
                    sessionId2Obj.put(userId, battleRoom);
                    userId2Session.put(userId, session);
                    session2UserId.put(session,userId);
                    userId2SessionId.put(userId, userId);
                    System.out.println("이번에 만들어짐 : " + sessionMap);
                    System.out.println("this is restTempalte : "+ restTemplate);

                    System.out.println("내 방에 접근할 세션 ID"+userId);
                    System.out.println("방에 대한 정보" + sessionId2Obj.get(userId));
//                    if(sessionId2Obj.get(userId))
//                    {
                    String url = "http://i8b303.p.ssafy.io:8000/problem-service/getThreeProblem?mmr="+mmrAvg;
//                ResponseEntity<JSONObject> problems = restTemplate.getForEntity(url,JSONObject.class);
                    List<Map<String,Object>> problems = restTemplate.getForObject(url,List.class);
                    HashMap<Integer,Boolean> getProblemListMap = new HashMap<>();
                    List<Problem> getProblemList = new ArrayList<>();
                    for(int i=0; i<problems.size(); i++)
                    {
                        Map<String,Object> prob = problems.get(i);
                        System.out.println(prob.get("problem_no"));
                        List<String> categorys = (List<String>) prob.get("problem_category");
                        System.out.println(categorys);
                        Problem problem = Problem.builder()
                                .problemNum(Integer.parseInt(prob.get("problem_no").toString()))
                                .problemCategory((List<String>) prob.get("problem_category"))
                                .build();
                        getProblemListMap.put(Integer.parseInt(prob.get("problem_no").toString()),true);
                        getProblemList.add(problem);
                        System.out.println("넣은 문제 : " + problem.toString());
                        System.out.println("문제 번호 : " + problem.getProblemNum());
                        for(int j=0; j<problem.problemCategory.size(); j++)
                        {
                            System.out.println("해당 문제의 카테고리 : "+problem.problemCategory.get(j));

                        }
                    }

                    sessionId2Obj.get(userId).problemBanCheck = getProblemListMap;
                    sessionId2Obj.get(userId).problemList = getProblemList;
//                    }
                }
                System.out.println();
                JSONObject data = new JSONObject();
                data.put("messageType","connect_success");
                synchronized (session) {
//                    session.sendMessage(message);
                    session.getAsyncRemote().sendText(data.toJSONString());
                }





            }
            /**벤픽 시작 전 3문제 얻어오기 요청 수행 (problem Service로 요청 전달)*/
            else if (method.equals("getProblem"))
            {
                String userId = obj.get("userId").toString();
                JSONObject problems_json = new JSONObject();
                JSONObject problems_category = new JSONObject();
                String sessionId;
                sessionId = userId2SessionId.get(userId);
                System.out.println("세션 아이디 : "+sessionId);
                System.out.println("세션 아이디 투 오브젝트 : " + sessionId2Obj.toString());
                System.out.println(sessionId2Obj.get(sessionId).toString());
                System.out.println(sessionId2Obj.get(sessionId).problemList);
                System.out.println(sessionId2Obj.get(sessionId).problemList.toString());

//                String[] problems_category = new String[sessionId2Obj.get(sessionId).problemList.size()];

                for(int i=0; i<sessionId2Obj.get(sessionId).problemList.size(); i++)
                {
//                    problems_category.put(i,sessionId2Obj.get(sessionId).problemList.get(i));
                    int problems_number = sessionId2Obj.get(sessionId).problemList.get(i).problemNum;
                    List<String> problems_category_array = new ArrayList<>();
                    for(int j=0; j<sessionId2Obj.get(sessionId).problemList.get(i).problemCategory.size();j++){
                        problems_category_array.add(sessionId2Obj.get(sessionId).problemList.get(i).problemCategory.get(j));
                    }
                    problems_category.put(problems_number,problems_category_array);
                }
                problems_json.put("messageType","sendProblem");
                problems_json.put("problems",problems_category);
                synchronized (session) {
//                    session.sendMessage(message);
                    session.getAsyncRemote().sendText(problems_json.toJSONString());
                }
//                sendProblems(session, problems_json);

                /****문제를 보내고 벤픽 시간을 제한해야 함****/

//                JSONObject banResult_json = new JSONObject();
//                TimerTask task = new TimerTask() {
//                    @Override
//                    public void run() {
//                        String sessionId="";
//                        if(sessionId2Obj.containsKey(userId))
//                        {
//                            sessionId = userId;
//                        }
//                        else
//                        {
//                            sessionId = userId2SessionId.get(userId);
//                        }
//                        System.out.println("내 아이디 : "+userId);
//                        System.out.println("문제 요청 부분의 세션 아이디 : "+sessionId);
//                        List<Integer> randomProblemList = new ArrayList<>();
//                        for (int key : sessionId2Obj.get(sessionId).problemList.keySet())
//                        {
//                            if(sessionId2Obj.get(sessionId).problemList.get(key))
//                            {
//                                randomProblemList.add(key);
//                            }
//                        }
//
//                        /**밴픽 시간이 다 지난 후에 밴픽을 끝내는 메시지와 함께 문제 전송*/
//                        Random random = new Random();
//                        int randomIndex = random.nextInt(randomProblemList.size());
//                        int selectProblemNum = randomProblemList.get(randomIndex);
//                        sessionId2Obj.get(sessionId).problemNum = selectProblemNum;
////                        String url = "http://localhost:9005/getProblem/"+selectProblemNum;
////                        ResponseEntity<List> problem = restTemplate.getForEntity(url,List.class);
////                        banResult_json.put("messageType","select_sucess");
////                        banResult_json.put("problemNum",selectProblemNum);
//                        //문제 이름, 번호같은 디테일 넣어야 함.
////                        banResult_json.put("problemName",)
//                    }
//                };
//                runCheck = true;
//                Timer timer = new Timer(true);
//                long delay = 5000;
//                timer.schedule(task, delay);

            }
            /**사용자가 밴을 할 때 들어오는 곳, 문제를 false로 바꿈*/
            else if (method.equals("ban"))
            {
                String userId = obj.get("userId").toString();
                String otherId = obj.get("otherId").toString();
                String problemNum = obj.get("problemNumber").toString();


                if(!problemNum.equals("timeout"))
                {
//                    sessionId2Obj.get(sessionId).problemList
                    sessionId2Obj.get(userId2SessionId.get(userId)).problemBanCheck.put(Integer.parseInt(problemNum),false);
                    System.out.println(sessionId2Obj.get(userId2SessionId.get(userId)).problemBanCheck.get(Integer.parseInt(problemNum))+"번 문제 밴됨");
                    if(sessionId2Obj.get(userId2SessionId.get(userId)).getUser1().userId.equals(userId))
                    {
                        sessionId2Obj.get(userId2SessionId.get(userId)).user1.banProblemNum = Integer.parseInt(problemNum);
                        System.out.println(userId +" 유저가 " + sessionId2Obj.get(userId2SessionId.get(userId)).user1.banProblemNum + "번 문제를 밴함");
                        System.out.println("현재 밴 상태 : "+ sessionId2Obj.get(userId2SessionId.get(userId)).problemBanCheck);
                    }
                    else
                    {
                        sessionId2Obj.get(userId2SessionId.get(userId)).user2.banProblemNum = Integer.parseInt(problemNum);
                        System.out.println(userId +" 유저가 " + sessionId2Obj.get(userId2SessionId.get(userId)).user2.banProblemNum + "번 문제를 밴함");
                        System.out.println("현재 밴 상태 : "+ sessionId2Obj.get(userId2SessionId.get(userId)).problemBanCheck);
                    }
                    if(sessionId2Obj.get(userId2SessionId.get(userId)).getUser1().banProblemNum!=0
                            && sessionId2Obj.get(userId2SessionId.get(userId)).getUser2().banProblemNum!=0)
                    {
                        System.out.println("두 명 다 밴이 끝남");
                        JSONObject data = new JSONObject();
                        int randomProblemCount=0;
                        int selectProblemResult = 0;
                        List<Integer> noSelectedProblemNumber = new ArrayList<>();
                        for(int key : sessionId2Obj.get(userId2SessionId.get(userId)).problemBanCheck.keySet())
                        {
                            if(sessionId2Obj.get(userId2SessionId.get(userId)).problemBanCheck.get(key)==true)
                            {
                                randomProblemCount++;
                                noSelectedProblemNumber.add(key);
                            }
                        }
                        System.out.println("현재 밴이 안된 문제 갯수 : "+randomProblemCount);
                        if(randomProblemCount>1)
                        {
                            Random random = new Random();
                            int randomIndex = random.nextInt(noSelectedProblemNumber.size());
                            selectProblemResult = noSelectedProblemNumber.get(randomIndex);
                        }
                        else
                        {
                            selectProblemResult = noSelectedProblemNumber.get(0);
                        }
                        String url = "http://i8b303.p.ssafy.io:8000/problem-service/getProblemDetail/"+selectProblemResult;
                        ResponseEntity<HashMap> problems = restTemplate.getForEntity(url,HashMap.class);
                        System.out.println(problems.getBody().toString());
                        System.out.println(problems.getBody().get("prob_name"));
                        data.put("messageType","select_success");
                        data.put("problem",problems.getBody());
                        userId2Session.get(userId).getAsyncRemote().sendText(data.toJSONString());
                        System.out.println(" 지금 유저 : " + userId2Session.get(userId));
                        System.out.println(" 다음 유저 : " + userId2Session.get(otherId));

                        synchronized (session) {
//                    session.sendMessage(message);
                            session.getAsyncRemote().sendText(data.toJSONString());
                        }
                        synchronized (session) {
//                    session.sendMessage(message);
                            userId2Session.get(otherId).getAsyncRemote().sendText(data.toJSONString());
//                            userId2Session.get(userId2SessionId.get(otherId)).getAsyncRemote().sendText(data.toJSONString());
                        }

//                        session.getAsyncRemote().sendText(data.toJSONString());
                    }
                    else
                    {
                        System.out.println("한명이 밴함");
                        JSONObject data = new JSONObject();
                        data.put("messageType","ban_success");
                        synchronized (session) {
//                    session.sendMessage(message);
                            session.getAsyncRemote().sendText(data.toJSONString());
                        }
                    }
                }
//                String sessionId = userId2Session.get(userId).getId();
//                sessionId2Obj.get(sessionId).problemList.put(problemNum,false);
            }

            /**문제를 제출했을 때 들어오는 곳, 채점서버로 요청 보내야 함.*/
            else if (method.equals("submit"))
            {
                String submitUserId = obj.get("userId").toString();
                String submitProblemNum = obj.get("problemNumber").toString();
                String submitCode = obj.get("code").toString();
                String submitBattleMode = obj.get("mode").toString();
                String submitLanguage = obj.get("language").toString();
                String url = "https://i8b303.p.ssafy.io:443/api/submission";
//                ResponseEntity<List> problem = restTemplate.getForEntity(url,List.class);
                HttpHeaders header = new HttpHeaders();
                header.add("Cookie","sessionid=lkftsz50s6aejyb4pdkz56kqksgl47nb");

                JSONObject bodyData = new JSONObject();
                bodyData.put("problem_id", submitProblemNum);
                bodyData.put("language",submitLanguage);
                bodyData.put("code",submitCode);
                HttpEntity<Map<String, Object>> entity =  new HttpEntity<>(bodyData, header);
//                ResponseEntity<HashMap> getSubmitToken = restTemplateForHttps.postForEntity(
//                        url,
//                        entity,
//                        HashMap.class
//                );

                ResponseDataDTO<Map<String,Object>> getSubmitToken =
                        restTemplateForHttps.exchange(
                                url ,
                                HttpMethod.POST ,
                                entity,
                                new ParameterizedTypeReference<ResponseDataDTO<Map<String,Object>>>() {}
                        ).getBody();


                System.out.println(getSubmitToken.getResponse());
                Map<String,Object> getSubmitTokenUnpack = (Map<String, Object>) getSubmitToken.getResponse().get("data");
                System.out.println(getSubmitTokenUnpack.get("submission_id"));
//                String submissionId = getSubmitToken.getBody().get("data").get("submission_id").toString();
//                url = "https://i8b303.p.ssafy.io:443/api/submission?"+submissionId;
//                ResponseEntity<HashMap> getSubmitResult = restTemplateForHttps.postForEntity(
//                        url,
//                        entity,
//                        HashMap.class
//                );
//                System.out.println(getSubmitResult.getBody());
            }

            else if (method.equals("msg"))
            {
                String msg = obj.get("msg").toString();
                StringBuilder sb = new StringBuilder();
                object = sessionId2Obj.get(session.getId());
                if (object instanceof User)
                {
//                    String id = ((User) object).getId();
//                    String name = userMap.get(id).getName();
//                    sb.append("[유저/").append(name).append("]");
                }
                sb.append(" : ").append(msg);
                sendMessageToAll(sb.toString());
            }
        }
    }

    private void sendProblems(Session session, JSONObject problems_json) {
//        Session session = null;
        session.getAsyncRemote().sendText(problems_json.toJSONString());
//        for (String sessionId : sessionId2Obj.keySet()) {
//            Object obj = sessionId2Obj.get(sessionId);
//            if ((obj instanceof User && ((User) obj).getId().equals(player2Id)) || (obj instanceof User && ((User) obj).getId().equals(player1Id))) {
//                session = sessionMap.get(sessionId);
//                System.out.println(session);
//                JSONObject send = new JSONObject();
//                if(((User) obj).getId().equals(player2Id)){
//                    send.put("userId", player2Id);
//                    send.put("otherId", player1Id);
//                }
//                else{
//                    send.put("userId", player1Id);
//                    send.put("otherId", player2Id);
//                }
//                session.getAsyncRemote().sendText(send.toJSONString());
//            }
//        }
    }


    /**
     * 웹소켓 사용자 연결 해제하는 경우 호출
     */
    @OnClose
    public void handleClose(Session session)
    {
        // 포네그리프
        if (session != null)
        {
            String sessionId = session.getId();
            sessionSet.remove(sessionId);

//            User user = sessionId2Obj.get(sessionId);
            String userId = session2UserId.get(session);
            session2UserId.remove(session);
            userId2SessionId.remove(userId);
            userId2Session.remove(userId);

            if(sessionId2Obj.containsKey(userId))
            {
                sessionId2Obj.remove(userId);
            };
            sessionMap.remove(sessionId);

//            userId2SessionId(session);
            String type = null;
            String id = null;

            type = "고객";
//            id = user.getId();
            userSet.remove(userId);
            userMap.remove(userId);

            printInfo();
        }
    }


    /**
     * 웹소켓 에러 발생하는 경우 호출
     */
    @OnError
    public void handleError(Throwable t)
    {
        t.printStackTrace();
    }

    public void printInfo()
    {

        System.out.println("sessionSet" + sessionSet);
        System.out.println("userSet" + userSet);
        System.out.println("userMap" + userMap);
        System.out.println("sessionId2Obj" + sessionId2Obj);
        System.out.println("sessionMap" + sessionMap);
        System.out.println("------------------------------");
    }

    public Set<String> getSessionSet()
    {
        return this.sessionSet;
    }

    private boolean sendMessageToAll(String message) {
        int sessionCount = sessionSet.size();
        if (sessionCount < 1) {
            return false;
        }

        Session singleSession = null;

        for (String name : sessionSet) {

            singleSession = sessionMap.get(name);
            if (singleSession == null) {
                continue;
            }
            if (!singleSession.isOpen()) {
                continue;
            }
            JSONObject send = new JSONObject();

            send.put("method", "msg");
            send.put("content",message);
            singleSession.getAsyncRemote().sendText(send.toJSONString());

        }

        return true;
    }

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

