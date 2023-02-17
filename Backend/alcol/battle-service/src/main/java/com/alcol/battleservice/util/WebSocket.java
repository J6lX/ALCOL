package com.alcol.battleservice.util;

import com.alcol.battleservice.config.ServerEndpointConfigurator;
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
import org.springframework.http.converter.json.GsonBuilderUtils;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import javax.net.ssl.SSLContext;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.lang.reflect.Array;
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
@ServerEndpoint(value="/battle-service", configurator = ServerEndpointConfigurator.class)
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
    private Timer timer;
    private static Set<String> sessionSet = new HashSet<String>();
    private static Map<String, Session> sessionMap = new HashMap<>();
    private static Map<String, BattleRoom> sessionId2Obj = new HashMap<>();
    private static Map<String, Session> userId2Session = new HashMap<>();
    private static Map<String, String> userId2SessionId = new HashMap<>();
    private static Map<Session, String> session2UserId = new HashMap<>();
    private static Map<String, User> userMap = new HashMap<>();
    private static Set<String> userSet = new HashSet<String>();
    private static Map<String, LocalTime> refreshMap = new HashMap<>();

    private static Map<String, Timer> timerMap = new HashMap<>();
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

//            if (!runCheck) {
//                TimerTask task = new TimerTask() {
//                    @Override
//                    public void run() {
//                    }
//                };
//                runCheck = true;
//                Timer timer = new Timer(true);
//                timer.scheduleAtFixedRate(task, 0, 15000);
//
//            }
            ;
        }
    }


    /**
     * 웹소켓 메시지(From Client) 수신하는 경우 호출
     */
    @OnMessage
    public void handleMessage(String jsonMessage, Session session) throws ParseException, IOException, URISyntaxException, InterruptedException {
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
                System.out.println("커넥트가 두번인가 ??");
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



                User user = User.builder().session(session).battleMode(battleMode).userId(userId).accept_time(-1).accept_memory(-1).prevMmr(userMmr).battleLog(new ArrayList<>()).battleMode(battleMode).build();
                if(hostCheck.equals("false"))
                {
                    while(true)
                    {
                        if(sessionId2Obj.containsKey(otherUserId))
                        {
                            sessionId2Obj.get(otherUserId).user2 = user;
                            userId2Session.put(userId, session);
                            session2UserId.put(session, userId);
                            userId2SessionId.put(userId, otherUserId);
                            System.out.println("이미 만들어져 있음 : "+ sessionMap.get(otherUserId).getId());
                            JSONObject data = new JSONObject();
                            data.put("messageType","connect_success");

                            System.out.println("mmr AVG : "+mmrAvg);
                            String url = "http://i8b303.p.ssafy.io:8000/problem-service/getThreeProblem?mmr="+mmrAvg;
//                ResponseEntity<JSONObject> problems = restTemplate.getForEntity(url,JSONObject.class);
                            List<Map<String,Object>> problems = restTemplate.getForObject(url,List.class);
                            HashMap<Integer,Boolean> getProblemListMap = new HashMap<>();
                            List<Problem> getProblemList = new ArrayList<>();
                            System.out.println(problems);
                            for(int i=0; i<problems.size(); i++)
                            {
                                Map<String,Object> prob = problems.get(i);
                                System.out.println(prob.get("prob_no"));
                                List<String> categorys = (List<String>) prob.get("prob_category");
                                System.out.println(categorys);
                                Problem problem = Problem.builder()
                                        .problemNum(Integer.parseInt(prob.get("prob_no").toString()))
                                        .problemCategory((List<String>) prob.get("prob_category"))
                                        .build();
                                getProblemListMap.put(Integer.parseInt(prob.get("prob_no").toString()),true);
                                getProblemList.add(problem);
                                System.out.println("넣은 문제 : " + problem.toString());
                                System.out.println("문제 번호 : " + problem.getProblemNum());
                                for(int j=0; j<problem.problemCategory.size(); j++)
                                {
                                    System.out.println("해당 문제의 카테고리 : "+problem.problemCategory.get(j));

                                }
                            }
                            System.out.println("문제 밴 체크 : "+sessionId2Obj.get(otherUserId).problemBanCheck);
                            System.out.println("문제 리스트 맵 : "+getProblemListMap);
                            sessionId2Obj.get(otherUserId).problemBanCheck = getProblemListMap;
                            sessionId2Obj.get(otherUserId).problemList = getProblemList;

                            synchronized (session) {
                                System.out.println("1번유저에게 리턴");
                                session.getBasicRemote().sendText(data.toJSONString());
                                System.out.println("2번유저에게 리턴");
                                userId2Session.get(otherUserId).getBasicRemote().sendText(data.toJSONString());
//                                userId2Session.get(otherUserId).getBasicRemote().sendText();
                                System.out.println("리턴 완료");
//                                userId2Session.get(otherUserId).getAsyncRemote().sendText(data.toJSONString());
//                                session.getAsyncRemote().sendText(data.toJSONString());
                            }
                            break;
                        }
                        else {
                            try
                            {
                                Thread.sleep(300);
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
                    BattleRoom battleRoom = BattleRoom.builder().user1(user).user2(user).problemBanCheck(new HashMap<Integer, Boolean>()).problemList(new ArrayList<Problem>()).build();
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

//                    }
                    System.out.println();
                    JSONObject data = new JSONObject();
                    data.put("messageType","connect_success");
                    synchronized (session) {
//                    session.sendMessage(message);
                        session.getBasicRemote().sendText(data.toJSONString());
                    }
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
//                System.out.println(sessionId2Obj.get(sessionId).toString());
                System.out.println(sessionId2Obj.get(sessionId).problemList);
                System.out.println(sessionId2Obj.get(sessionId).problemList.toString());

//                String[] problems_category = new String[sessionId2Obj.get(sessionId).problemList.size()];

                /**
                 * 랜덤으로 뽑은 문제가 없을 때
                 * 3문제를 받아와서 먼저 랜덤으로 하나 골라놓음.
                 */
                if(sessionId2Obj.get(sessionId).problemNum==0)
                {
                    Random random = new Random();
                    int randomIndex = random.nextInt(sessionId2Obj.get(sessionId).problemList.size());
                    List<Integer> problemNumberList = new ArrayList<>();
                    sessionId2Obj.get(sessionId).problemNum = sessionId2Obj.get(sessionId).problemList.get(randomIndex).problemNum;

//                    for(int number : sessionId2Obj.get(sessionId).problemBanCheck.keySet())
//                    {
//                    }

//                    sessionId2Obj.get(userId2SessionId.get(userId)).problemNum = selectProblemResult;
                }

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
                    session.getBasicRemote().sendText(problems_json.toJSONString());
                }
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
                    Random random = new Random();
                    int randomIndex = random.nextInt(noSelectedProblemNumber.size());
                    selectProblemResult = noSelectedProblemNumber.get(randomIndex);
                    if(randomProblemCount>1)
                    {
                        sessionId2Obj.get(userId2SessionId.get(userId)).problemNum = selectProblemResult;
                    }

//                    List<Integer> problemNumberList = new ArrayList<>();
                    sessionId2Obj.get(userId2SessionId.get(userId)).problemNum = sessionId2Obj.get(userId2SessionId.get(userId)).problemList.get(randomIndex).problemNum;
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
                        randomProblemCount=0;
                        selectProblemResult = 0;
                        noSelectedProblemNumber = new ArrayList<>();
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
                            random = new Random();
                            randomIndex = random.nextInt(noSelectedProblemNumber.size());
                            selectProblemResult = noSelectedProblemNumber.get(randomIndex);
                            sessionId2Obj.get(userId2SessionId.get(userId)).problemNum = selectProblemResult;
                        }
                        else
                        {
                            selectProblemResult = noSelectedProblemNumber.get(0);
                            sessionId2Obj.get(userId2SessionId.get(userId)).problemNum = selectProblemResult;
                        }
                        JSONObject data = new JSONObject();
                        String url = "http://i8b303.p.ssafy.io:8000/problem-service/getProblemDetail/"+selectProblemResult;
                        ResponseEntity<HashMap> problems = restTemplate.getForEntity(url,HashMap.class);
                        System.out.println(problems.getBody().toString());
                        System.out.println(problems.getBody().get("prob_name"));
                        sessionId2Obj.get(userId2SessionId.get(userId)).time_limit = (int) problems.getBody().get("prob_time_limit");
                        sessionId2Obj.get(userId2SessionId.get(userId)).memory_limit = (int) problems.getBody().get("prob_memory_limit");
                        data.put("messageType","select_success");
                        data.put("problem",problems.getBody());
                        userId2Session.get(userId).getBasicRemote().sendText(data.toJSONString());
                        System.out.println(" 지금 유저 : " + userId2Session.get(userId));
                        System.out.println(" 다음 유저 : " + userId2Session.get(otherId));

                        synchronized (session)
                        {
                            userId2Session.get(otherId).getBasicRemote().sendText(data.toJSONString());
                        }
                    }
                    else
                    {
                        System.out.println("한명이 밴함");
                        JSONObject data = new JSONObject();
                        data.put("messageType","ban_success");
                        synchronized (session) {
//                    session.sendMessage(message);
                            session.getBasicRemote().sendText(data.toJSONString());
                        }
                    }
                }
            }
            /**
             * 타이머 시작
             */
            else if (method.equals("battleStart"))
            {
                String userId = obj.get("userId").toString();
                String otherUserId = obj.get("otherId").toString();
                String battleMode = sessionId2Obj.get(userId2SessionId.get(userId)).user1.battleMode;

                if(session==sessionId2Obj.get(userId2SessionId.get(userId)).user1.session
                        && sessionId2Obj.get(userId2SessionId.get(userId)).user1.userId.equals(userId))
                {
                    System.out.println("타이머 시작");
                    System.out.println("나의 세션"+session);
                    System.out.println("저장되어 있는 세션 : " +sessionId2Obj.get(userId2SessionId.get(userId)));
                    System.out.println("저는 1번 유저입니다.");
                    timer = new Timer();
                    /**
                     * 아래 시간 쪽에 게임 끝나는 시간 설정
                     * 세션에 Timer 할당
                     */
                    timer.schedule(new SessionTimerTask(session,userId,otherUserId,battleMode), 3600000); //
                    timerMap.put(sessionId2Obj.get(userId2SessionId.get(userId)).user1.userId,timer);
                }
            }

            else if (method.equals("banTimeout"))
            {
                String userId = obj.get("userId").toString();
                String otherId = obj.get("otherId").toString();

                int selectProblemResult =sessionId2Obj.get(userId2SessionId.get(userId)).problemNum;
                String url = "http://i8b303.p.ssafy.io:8000/problem-service/getProblemDetail/"+selectProblemResult;

                ResponseEntity<HashMap> problems = restTemplate.getForEntity(url,HashMap.class);
                System.out.println(problems.getBody().toString());
                System.out.println(problems.getBody().get("prob_name"));

                sessionId2Obj.get(userId2SessionId.get(userId)).time_limit = (int) problems.getBody().get("prob_time_limit");
                sessionId2Obj.get(userId2SessionId.get(userId)).memory_limit = (int) problems.getBody().get("prob_memory_limit");


                JSONObject data = new JSONObject();
                data.put("messageType","select_success");
                data.put("problem",problems.getBody());
                userId2Session.get(userId).getBasicRemote().sendText(data.toJSONString());
                System.out.println(" 지금 유저 : " + userId2Session.get(userId));
                System.out.println(" 다음 유저 : " + userId2Session.get(otherId));

                synchronized (session)
                {
                    userId2Session.get(otherId).getBasicRemote().sendText(data.toJSONString());
                }
            }

            else if (method.equals("surrender"))
            {
                String surrenderUserId = obj.get("userId").toString();
                String surrenderOtherId = obj.get("otherId").toString();
                String surrenderBattleMode = obj.get("mode").toString();
                String surrenderLanguage = obj.get("language").toString();
                timerMap.get(sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user1.userId).cancel();

                if(sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user1.userId.equals(surrenderUserId))
                {
                    sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user2.battleResult="win";
                    sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user1.battleResult="lose";
                }
                else
                {
                    sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user1.battleResult="win";
                    sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user2.battleResult="lose";
                }
                int user_mmr=0;
                int other_mmr=0;
                float user_odds=0;
                float other_odds=0;
                if(sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user1.userId.equals(surrenderUserId))
                {
//                    sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user1.battleLog.add(surrenderUserId);
                    user_mmr = sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user1.prevMmr;
                    other_mmr = sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user2.prevMmr;
                }
                else if(sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user2.userId.equals(surrenderUserId))
                {
//                    sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user2.battleLog.add(surrenderUserId);
                    user_mmr = sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user2.prevMmr;
                    other_mmr = sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user1.prevMmr;
                }

                user_odds = 1.0f * 1.0f / (1 + 1.0f * (float)(Math.pow(10, 1.0f * (other_mmr - user_mmr) / 400)));
                other_odds = 1.0f * 1.0f / (1 + 1.0f * (float)(Math.pow(10, 1.0f * (user_mmr - other_mmr) / 400)));
                int change_user_mmr = (int) (user_mmr+30*(0-user_odds));
                int change_other_mmr = (int) (other_mmr+30*(1-other_odds));
                int result_user_mmr = change_user_mmr - user_mmr ;
                int result_other_mmr = change_other_mmr - other_mmr ;

                JSONObject user_submit_result_send = new JSONObject();
                user_submit_result_send.put("messageType","battleResult");
                user_submit_result_send.put("battleResult","surrender");
                user_submit_result_send.put("changeExp","50");
                user_submit_result_send.put("changeMmr",result_user_mmr);

                JSONObject other_submit_result_send = new JSONObject();
                other_submit_result_send.put("messageType","otherSurrender");
                other_submit_result_send.put("battleResult","win");
                other_submit_result_send.put("changeExp","100");
                other_submit_result_send.put("changeMmr",result_other_mmr);

                if(sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user1.userId.equals(surrenderUserId))
                {
                    sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user1.nowMmr = change_user_mmr;
                    sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user2.nowMmr = change_other_mmr;
                }
                else if(sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user2.userId.equals(surrenderUserId))
                {
                    sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user1.nowMmr = change_other_mmr;
                    sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user2.nowMmr = change_user_mmr;
                }
                /**
                 * 배틀 정보를 Log Service로 넘기는 부분
                 */

                Map<String, Object> sendBattleLog = new HashMap<>();
                sendBattleLog.put("battleMode",surrenderBattleMode);
                sendBattleLog.put("probNum",sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).problemNum);

                /**
                 * 레디스에 들어갈 정보
                 */
                Map<String,String> sendBattleLogForRedis = new HashMap<>();

                /**
                 * 만약 항복한 유저가 1번 유저라면 ?
                 */
                if(sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user1.userId.equals(surrenderUserId))
                {
                    /**
                     * 1번유저가 항복했으면 무조건 2번유저가 이기는 로직
                     */

                    sendBattleLogForRedis.put("user_id_1",surrenderUserId);
                    sendBattleLogForRedis.put("user_id_2",surrenderOtherId);
                    sendBattleLogForRedis.put("battle_mode",surrenderBattleMode);
                    sendBattleLogForRedis.put("mmr_1", String.valueOf(sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user1.nowMmr));
                    sendBattleLogForRedis.put("mmr_2", String.valueOf(sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user2.nowMmr));
                    sendBattleLogForRedis.put("winner","2");

                    sendBattleLog.put("winnerUserId",surrenderOtherId);
                    sendBattleLog.put("loserUserId",surrenderUserId);
                    sendBattleLog.put("winnerPrevMmr",sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user2.prevMmr);
                    sendBattleLog.put("winnerNowMmr",sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user2.nowMmr);
                    sendBattleLog.put("winnerSubmitLog",sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user2.battleLog);
                    sendBattleLog.put("loserPrevMmr",sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user1.prevMmr);
                    sendBattleLog.put("loserNowMmr",sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user1.nowMmr);
                    sendBattleLog.put("loserSubmitLog",sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user1.battleLog);


                }
                /**
                 * 만약 제출한 유저가 2번 유저라면 ?
                 */
                else
                {
                    sendBattleLogForRedis.put("user_id_1",surrenderUserId);
                    sendBattleLogForRedis.put("user_id_2",surrenderOtherId);
                    sendBattleLogForRedis.put("battle_mode",surrenderBattleMode);
                    sendBattleLogForRedis.put("mmr_1", String.valueOf(sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user1.nowMmr));
                    sendBattleLogForRedis.put("mmr_2", String.valueOf(sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user2.nowMmr));
                    sendBattleLogForRedis.put("winner","1");

                    sendBattleLog.put("winnerUserId",surrenderUserId);
                    sendBattleLog.put("loserUserId",surrenderOtherId);
                    sendBattleLog.put("winnerPrevMmr",sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user1.prevMmr);
                    sendBattleLog.put("winnerNowMmr",sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user1.nowMmr);
                    sendBattleLog.put("winnerSubmitLog",sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user1.battleLog);
                    sendBattleLog.put("loserPrevMmr",sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user2.prevMmr);
                    sendBattleLog.put("loserNowMmr",sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user2.nowMmr);
                    sendBattleLog.put("loserSubmitLog",sessionId2Obj.get(userId2SessionId.get(surrenderUserId)).user2.battleLog);
                }
                /**
                 * 항복 정보 log service로 보냄
                 */
                String url_log = "http://i8b303.p.ssafy.io:9005/log-service/insertBattleLog";
                String getBattleLogSaveResult = restTemplate.postForObject(
                        url_log,
                        sendBattleLog,
                        String.class
                );

                /**
                 * 항복 정보 rank service로 보냄
                 */
                String url_rank = "http://i8b303.p.ssafy.io:9003/rank-service/battleResult";
                String sendRedisRankUpdate = restTemplate.postForObject(
                        url_rank,
                        sendBattleLogForRedis,
                        String.class
                );
                synchronized (session)
                {
                    session.getBasicRemote().sendText(user_submit_result_send.toJSONString());
                    handleClose(session);
                }
                synchronized (userId2Session.get(surrenderOtherId))
                {
                    userId2Session.get(surrenderOtherId).getBasicRemote().sendText(other_submit_result_send.toJSONString());
                    handleClose(userId2Session.get(surrenderOtherId));
                }
            }

            /**문제를 제출했을 때 들어오는 곳, 채점서버로 요청 보내야 함.*/
            else if (method.equals("submit"))
            {
                String submitUserId = obj.get("userId").toString();
                String submitOtherId = obj.get("otherId").toString();
                String submitProblemNum = obj.get("problemNumber").toString();
                String submitCode = obj.get("code").toString();
                String submitBattleMode = obj.get("mode").toString();
                String submitLanguage = obj.get("language").toString();
                String url = "https://i8b303.p.ssafy.io:1443/api/submission";
                HttpHeaders header = new HttpHeaders();

                /**문제 채점 항목에 대한 번호를 받아오는 곳*/

                header.add("Cookie","sessionid=lkftsz50s6aejyb4pdkz56kqksgl47nb");
                System.out.println(submitCode);
                JSONObject bodyData = new JSONObject();
                bodyData.put("problem_id", submitProblemNum);
                bodyData.put("language",submitLanguage);
                bodyData.put("code",submitCode);
                HttpEntity<Map<String, Object>> entity =  new HttpEntity<>(bodyData, header);
                JSONObject getSubmitToken = restTemplateForHttps.postForObject(
                        url,
                        entity,
                        JSONObject.class
                );

                System.out.println(getSubmitToken.get("data"));

                /**
                 * 문제 채점 번호로 조회 하는 곳
                 * result = 6 , 7은 제외 0일때는 통과인듯.
                 * */
                Map<String,String> getSubmiTokenJson = (Map<String, String>) getSubmitToken.get("data");
                String submissionId = getSubmiTokenJson.get("submission_id");
                url = "https://i8b303.p.ssafy.io:1443/api/submission?id="+submissionId;
                while(true)
                {
                    ResponseEntity<JSONObject> getSubmitResult = restTemplateForHttps.exchange(
                            url,
                            HttpMethod.GET,
                            entity,
                            JSONObject.class
                    );
                    System.out.println("바디까지 : "+ getSubmitResult.getBody());
                    HashMap<String, Object> fromdata = (HashMap<String, Object>) getSubmitResult.getBody().get("data");
                    System.out.println("data까지 : "+getSubmitResult.getBody().get("data"));
                    System.out.println("result까지 : "+fromdata.get("result"));
                    int submit_result = (int) fromdata.get("result");
                    /**
                     * 채점이 완료되면 6이나 7이 안나옴. 그래서 반복요청 보냄
                     * */
                    if(submit_result==6||submit_result==7)
                    {
                        System.out.println("다시 돌아감");
                        Thread.sleep(3000);
                        continue;
                    }

                    /**
                     * 채점 완료되고, 해당 항목을 불러올 수 있을 때. result도 보고 for문으로 info를 봐야함.
                     * statistic_info 안에 time_cost : 채점 돌아간 시간
                     * statistic_info 안에 memory_cost : 사용 메모리
                     * err : 에러 발생 ?
                     * 몇개 맞았는지 보려면 info 안에 data 갯수 세고 그만큼 for문 돌면서 err 갯수 찾기 ?
                     * 스피드전에서 result 가 0이라면 승리를 의미. 바로 MMR 계산.
                     */
//                    else if(submit_result==1)
//                    {
//                        JSONObject submit_error_send = new JSONObject();
//                        submit_error_send.put("messageType","error");
//                        submit_error_send.put("errorMessage","");
//                    }
                    else if(submit_result==0)
                    {
                        //statistic_info 안에는 속도, 메모리에 관련된 내용이 들어 있음
                        HashMap<String,Object> fromdata_statistic_info = (HashMap<String, Object>)fromdata.get("statistic_info");
                        //formdata_info에는 info 들이 들어있음. info 안에는 어떤 테케가 어떻게 됐는지 들어 있음
                        HashMap<String,Object> fromdata_info = (HashMap<String, Object>)fromdata.get("info");
                        List<HashMap<String,Object>> fromdata_info_data = (List<HashMap<String, Object>>) fromdata_info.get("data");
                        System.out.println("맞았습니다.");
                        System.out.println("테케 갯수 : "+fromdata_info_data.size());
                        System.out.println("속도 :"+ fromdata_statistic_info.get("time_cost"));
                        System.out.println("메모리 : "+fromdata_statistic_info.get("memory_cost"));
                        BattleLog userBattleLog = BattleLog.builder().result("Accepted").memory(fromdata_statistic_info.get("memory_cost").toString()).time(fromdata_statistic_info.get("time_cost").toString()).build();


                        /**
                         * 만약 스피드 모드라면, 채점이 완료 되었으니 끝나야 함
                         * MMR 계산
                         * BattleLog로 만든 후 User에 넣기
                         * Log Service로 보내기
                         * Rank Service로 보내기
                         * 타이머 끄기
                         */
                        if(submitBattleMode.equals("speed"))
                        {

                            /**
                             * 타이머 정지
                             */
                            timerMap.get(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.userId).cancel();


                            if(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.userId.equals(submitUserId))
                            {
                                sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.battleResult="win";
                                sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.battleResult="lose";
                            }
                            else
                            {
                                sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.battleResult="win";
                                sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.battleResult="lose";
                            }
                            int user_mmr=0;
                            int other_mmr=0;
                            float user_odds=0;
                            float other_odds=0;
                            if(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.userId.equals(submitUserId))
                            {
                                sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.battleLog.add(userBattleLog);
                                user_mmr = sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.prevMmr;
                                other_mmr = sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.prevMmr;

                            }
                            else if(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.userId.equals(submitUserId))
                            {
                                sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.battleLog.add(userBattleLog);
                                user_mmr = sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.prevMmr;
                                other_mmr = sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.prevMmr;
                            }


                            /**
                             * mmr 계산식
                             * ELO Algorithm = Pa = Pb + K * (W - We)
                             * Pa = 경기 후의 점수
                             * Pb = 경기 전의 점수
                             * K = 가중치
                             * W = 경기 결과 (승리 1, 무승부 0.5, 패배 0)
                             * We = 예상 승률
                             *
                             * 예상 승률 We = (1.0 / (1.0 + pow(10, ((1000-1200) / 400))))
                             */
                            /**-----------------------------------------------------------------------------------------------*/

                            user_odds = 1.0f * 1.0f / (1 + 1.0f * (float)(Math.pow(10, 1.0f * (other_mmr - user_mmr) / 400)));
                            other_odds = 1.0f * 1.0f / (1 + 1.0f * (float)(Math.pow(10, 1.0f * (user_mmr - other_mmr) / 400)));
                            int change_user_mmr = (int) (user_mmr+30*(1-user_odds));
                            int change_other_mmr = (int) (other_mmr+30*(0-other_odds));
                            int result_user_mmr = change_user_mmr - user_mmr;
                            int result_other_mmr = change_other_mmr - other_mmr;

                            /**-----------------------------------------------------------------------------------------------*/

                            System.out.println("경기 전 user mmr : "+ user_mmr);
                            System.out.println("경기 후 user mmr : "+ change_user_mmr);
                            System.out.println("경기 전 other mmr : "+ other_mmr);
                            System.out.println("경기 후 other mmr : "+ change_other_mmr);
                            JSONObject user_submit_result_send = new JSONObject();
                            user_submit_result_send.put("messageType","battleResult");
                            user_submit_result_send.put("battleResult","win");
                            user_submit_result_send.put("changeExp","100");
                            user_submit_result_send.put("time",fromdata_statistic_info.get("time_cost"));
                            user_submit_result_send.put("memory",fromdata_statistic_info.get("memory_cost"));
                            user_submit_result_send.put("changeMmr",result_user_mmr);


                            JSONObject other_submit_result_send = new JSONObject();
                            other_submit_result_send.put("messageType","battleResult");
                            other_submit_result_send.put("battleResult","lose");
                            other_submit_result_send.put("time",fromdata_statistic_info.get("time_cost"));
                            other_submit_result_send.put("memory",fromdata_statistic_info.get("memory_cost"));
                            other_submit_result_send.put("changeExp","50");
                            other_submit_result_send.put("changeMmr",result_other_mmr);
                            /**
                             * 스피드 전이니까, 끝나면 MMR, 경험치 계산 후
                             * 나와 상대방에게 게임 끝 메시지를 보내고
                             * 게임에 대한 모든 정보를 log 서버로 전송해야 함.
                             */


                            /**
                             * mmr을 저장하는 부분
                             * Log Service로 보내기 위함
                             */
                            if(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.userId.equals(submitUserId))
                            {
                                sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.nowMmr = change_user_mmr;
                                sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.nowMmr = change_other_mmr;
                            }
                            else if(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.userId.equals(submitUserId))
                            {
                                sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.nowMmr = change_other_mmr;
                                sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.nowMmr = change_user_mmr;
                            }
                            /**
                             * 배틀 정보를 Log Service로 넘기는 부분
                             */

                            Map<String, Object> sendBattleLog = new HashMap<>();
                            sendBattleLog.put("battleMode",submitBattleMode);
                            sendBattleLog.put("probNum",sessionId2Obj.get(userId2SessionId.get(submitUserId)).problemNum);


                            /**
                             * 레디스에 들어갈 정보
                             */
                            Map<String,String> sendBattleLogForRedis = new HashMap<>();


                            /**
                             * 만약 제출한 유저가 1번 유저라면 ?
                             */
                            if(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.userId.equals(submitUserId))
                            {
                                /**
                                 * 제출한 1번 유저가 이겼다면 ?
                                 */
                                if(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.battleResult.equals("win"))
                                {
                                    sendBattleLogForRedis.put("user_id_1",submitUserId);
                                    sendBattleLogForRedis.put("user_id_2",submitOtherId);
                                    sendBattleLogForRedis.put("battle_mode",submitBattleMode);
                                    sendBattleLogForRedis.put("mmr_1", String.valueOf(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.nowMmr));
                                    sendBattleLogForRedis.put("mmr_2", String.valueOf(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.nowMmr));
                                    sendBattleLogForRedis.put("winner","1");

                                    sendBattleLog.put("winnerUserId",submitUserId);
                                    sendBattleLog.put("loserUserId",submitOtherId);
                                    sendBattleLog.put("winnerPrevMmr",sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.prevMmr);
                                    sendBattleLog.put("winnerNowMmr",sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.nowMmr);
                                    sendBattleLog.put("winnerSubmitLog",sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.battleLog);
                                    sendBattleLog.put("loserPrevMmr", sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.prevMmr);
                                    sendBattleLog.put("loserNowMmr", sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.nowMmr);
                                    sendBattleLog.put("loserSubmitLog",sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.battleLog);
                                    System.out.println("제출한 유저 : 1, 승리 + "+ sendBattleLogForRedis);
                                }
                                /**
                                 * 제출한 1번 유저가 졌다면 ?
                                 */
                                else
                                {
                                    sendBattleLogForRedis.put("user_id_1",submitUserId);
                                    sendBattleLogForRedis.put("user_id_2",submitOtherId);
                                    sendBattleLogForRedis.put("battle_mode",submitBattleMode);
                                    sendBattleLogForRedis.put("mmr_1", String.valueOf(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.nowMmr));
                                    sendBattleLogForRedis.put("mmr_2", String.valueOf(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.nowMmr));
                                    sendBattleLogForRedis.put("winner","2");

                                    sendBattleLog.put("winnerUserId",submitOtherId);
                                    sendBattleLog.put("loserUserId",submitUserId);
                                    sendBattleLog.put("winnerPrevMmr",sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.prevMmr);
                                    sendBattleLog.put("winnerNowMmr",sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.nowMmr);
                                    sendBattleLog.put("winnerSubmitLog",sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.battleLog);
                                    sendBattleLog.put("loserPrevMmr",sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.prevMmr);
                                    sendBattleLog.put("loserNowMmr",sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.nowMmr);
                                    sendBattleLog.put("loserSubmitLog",sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.battleLog);
                                    System.out.println("제출한 유저 : 2, 패배 + "+ sendBattleLogForRedis);
                                }
                            }
                            /**
                             * 만약 제출한 유저가 2번 유저라면 ?
                             */
                            else
                            {
                                if(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.battleResult.equals("win"))
                                {
                                    sendBattleLogForRedis.put("user_id_1",submitOtherId);
                                    sendBattleLogForRedis.put("user_id_2",submitUserId);
                                    sendBattleLogForRedis.put("battle_mode",submitBattleMode);
                                    sendBattleLogForRedis.put("mmr_1", String.valueOf(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.nowMmr));
                                    sendBattleLogForRedis.put("mmr_2", String.valueOf(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.nowMmr));
                                    sendBattleLogForRedis.put("winner","2");

                                    sendBattleLog.put("winnerUserId",submitUserId);
                                    sendBattleLog.put("loserUserId",submitOtherId);
                                    sendBattleLog.put("winnerPrevMmr",sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.prevMmr);
                                    sendBattleLog.put("winnerNowMmr",sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.nowMmr);
                                    sendBattleLog.put("winnerSubmitLog",sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.battleLog);
                                    sendBattleLog.put("loserPrevMmr", sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.prevMmr);
                                    sendBattleLog.put("loserNowMmr", sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.nowMmr);
                                    sendBattleLog.put("loserSubmitLog",sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.battleLog);
                                    System.out.println("제출한 유저 : 2, 승리 + "+ sendBattleLogForRedis);
                                }
                                else
                                {
                                    sendBattleLogForRedis.put("user_id_1",submitOtherId);
                                    sendBattleLogForRedis.put("user_id_2",submitUserId);
                                    sendBattleLogForRedis.put("battle_mode",submitBattleMode);
                                    sendBattleLogForRedis.put("mmr_1", String.valueOf(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.nowMmr));
                                    sendBattleLogForRedis.put("mmr_2", String.valueOf(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.nowMmr));
                                    sendBattleLogForRedis.put("winner","1");

                                    sendBattleLog.put("winnerUserId",submitOtherId);
                                    sendBattleLog.put("loserUserId",submitUserId);
                                    sendBattleLog.put("winnerPrevMmr",sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.prevMmr);
                                    sendBattleLog.put("winnerNowMmr",sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.nowMmr);
                                    sendBattleLog.put("winnerSubmitLog",sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.battleLog);
                                    sendBattleLog.put("loserPrevMmr",sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.prevMmr);
                                    sendBattleLog.put("loserNowMmr",sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.nowMmr);
                                    sendBattleLog.put("loserSubmitLog",sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.battleLog);
                                    System.out.println("제출한 유저 : 2, 패배 + "+ sendBattleLogForRedis);
                                }
                            }
//                            sendBattleLog.put("user1",sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1);
//                            sendBattleLog.put("user2",sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2);
//                            BattleRoom sendBattleLog = sessionId2Obj.get(userId2SessionId.get(submitUserId));
//                            System.out.println(sessionId2Obj.get(userId2SessionId.get(submitUserId)));
//                            sendBattleLog.put("battleLog", battleRoomJson);
                            String url_log = "http://i8b303.p.ssafy.io:9005/log-service/insertBattleLog";
                            String getBattleLogSaveResult = restTemplate.postForObject(
                                    url_log,
                                    sendBattleLog,
                                    String.class
                            );

                            String url_rank = "http://i8b303.p.ssafy.io:9003/rank-service/battleResult";
                            String sendRedisRankUpdate = restTemplate.postForObject(
                                    url_rank,
                                    sendBattleLogForRedis,
                                    String.class
                            );
                            System.out.println("레디스 서버에 전송 : "+sendRedisRankUpdate);
                            System.out.println(getBattleLogSaveResult);
                            synchronized (session)
                            {
                                session.getBasicRemote().sendText(user_submit_result_send.toJSONString());
                                handleClose(session);
                            }
                            synchronized (userId2Session.get(submitOtherId))
                            {
                                userId2Session.get(submitOtherId).getBasicRemote().sendText(other_submit_result_send.toJSONString());
                                handleClose(userId2Session.get(submitOtherId));
                            }
                        }
                        else if(submitBattleMode.equals("optimization"))
                        {
                            if(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.userId.equals(submitUserId))
                            {
                                sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.battleLog.add(userBattleLog);
                                sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.accept_time = Integer.parseInt(userBattleLog.time);
                                sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.accept_memory = Integer.parseInt(userBattleLog.memory);
                            }
                            else if(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.userId.equals(submitUserId))
                            {
                                sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.battleLog.add(userBattleLog);
                                sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.accept_time = Integer.parseInt(userBattleLog.time);
                                sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.accept_memory = Integer.parseInt(userBattleLog.memory);
                            }
                            JSONObject user_submit_result_send = new JSONObject();
                            user_submit_result_send.put("messageType","submitResult");
                            user_submit_result_send.put("submitResult","accept");
                            user_submit_result_send.put("time",fromdata_statistic_info.get("time_cost"));
                            user_submit_result_send.put("memory",fromdata_statistic_info.get("memory_cost"));

                            JSONObject other_submit_result_send = new JSONObject();
                            other_submit_result_send.put("messageType","otherSubmitResult");
                            other_submit_result_send.put("submitResult","accept");
                            other_submit_result_send.put("time",fromdata_statistic_info.get("time_cost"));
                            other_submit_result_send.put("memory",fromdata_statistic_info.get("memory_cost"));

                            synchronized (session)
                            {
                                session.getBasicRemote().sendText(user_submit_result_send.toJSONString());
                            }
                            synchronized (userId2Session.get(submitOtherId))
                            {
                                userId2Session.get(submitOtherId).getBasicRemote().sendText(other_submit_result_send.toJSONString());
                            }
                        }
                        break;

                    }
                    /**
                     * CPU 시간 초과
                     */
                    else if(submit_result==1)
                    {
                        JSONObject user_submit_result_send = new JSONObject();
                        user_submit_result_send.put("messageType","error");
                        user_submit_result_send.put("errorMessage","CPU 시간 초과");


                        JSONObject other_submit_result_send = new JSONObject();
                        other_submit_result_send.put("messageType","otherError");
                        other_submit_result_send.put("errorMessage","CPU 시간 초과");

                        BattleLog userBattleLog = BattleLog.builder().result("Error").memory("0").time("0").build();

                        if(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.userId.equals(submitUserId))
                        {
                            sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.battleLog.add(userBattleLog);
                        }
                        else if(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.userId.equals(submitUserId))
                        {
                            sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.battleLog.add(userBattleLog);
                        }

                        synchronized (session)
                        {
                            session.getBasicRemote().sendText(user_submit_result_send.toJSONString());
                        }
                        synchronized (userId2Session.get(submitOtherId))
                        {
                            userId2Session.get(submitOtherId).getBasicRemote().sendText(other_submit_result_send.toJSONString());
                        }
                    }
                    /**
                     * REATIME 초과
                     */
                    else if(submit_result==2)
                    {
                        JSONObject user_submit_result_send = new JSONObject();
                        user_submit_result_send.put("messageType","error");
                        user_submit_result_send.put("errorMessage","REALTIME 시간 초과");


                        JSONObject other_submit_result_send = new JSONObject();
                        other_submit_result_send.put("messageType","otherError");
                        other_submit_result_send.put("errorMessage","REALTIME 시간 초과");

                        BattleLog userBattleLog = BattleLog.builder().result("Error").memory("0").time("0").build();

                        if(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.userId.equals(submitUserId))
                        {
                            sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.battleLog.add(userBattleLog);
                        }
                        else if(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.userId.equals(submitUserId))
                        {
                            sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.battleLog.add(userBattleLog);
                        }

                        synchronized (session)
                        {
                            session.getBasicRemote().sendText(user_submit_result_send.toJSONString());
                        }
                        synchronized (userId2Session.get(submitOtherId))
                        {
                            userId2Session.get(submitOtherId).getBasicRemote().sendText(other_submit_result_send.toJSONString());
                        }
                    }
                    /**
                     * Memory 초과
                     */
                    else if(submit_result==3)
                    {
                        JSONObject user_submit_result_send = new JSONObject();
                        user_submit_result_send.put("messageType","error");
                        user_submit_result_send.put("errorMessage","메모리 초과");


                        JSONObject other_submit_result_send = new JSONObject();
                        other_submit_result_send.put("messageType","otherError");
                        other_submit_result_send.put("errorMessage","메모리 초과");

                        BattleLog userBattleLog = BattleLog.builder().result("Error").memory("0").time("0").build();

                        if(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.userId.equals(submitUserId))
                        {
                            sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.battleLog.add(userBattleLog);
                        }
                        else if(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.userId.equals(submitUserId))
                        {
                            sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.battleLog.add(userBattleLog);
                        }

                        synchronized (session)
                        {
                            session.getBasicRemote().sendText(user_submit_result_send.toJSONString());
                        }
                        synchronized (userId2Session.get(submitOtherId))
                        {
                            userId2Session.get(submitOtherId).getBasicRemote().sendText(other_submit_result_send.toJSONString());
                        }
                    }
                    /**
                     * RUNTIME 에러
                     */
                    else if(submit_result==4)
                    {
                        JSONObject user_submit_result_send = new JSONObject();
                        user_submit_result_send.put("messageType","error");
                        user_submit_result_send.put("errorMessage","런타임 에러");


                        JSONObject other_submit_result_send = new JSONObject();
                        other_submit_result_send.put("messageType","otherError");
                        other_submit_result_send.put("errorMessage","런타임 에러");

                        BattleLog userBattleLog = BattleLog.builder().result("Error").memory("0").time("0").build();

                        if(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.userId.equals(submitUserId))
                        {
                            sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.battleLog.add(userBattleLog);
                        }
                        else if(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.userId.equals(submitUserId))
                        {
                            sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.battleLog.add(userBattleLog);
                        }

                        synchronized (session)
                        {
                            session.getBasicRemote().sendText(user_submit_result_send.toJSONString());
                        }
                        synchronized (userId2Session.get(submitOtherId))
                        {
                            userId2Session.get(submitOtherId).getBasicRemote().sendText(other_submit_result_send.toJSONString());
                        }
                    }
                    /**
                     * SYSTEM ERROR
                     */
                    else if(submit_result==5)
                    {
                        JSONObject user_submit_result_send = new JSONObject();
                        user_submit_result_send.put("messageType","error");
                        user_submit_result_send.put("errorMessage","시스템 에러");


                        JSONObject other_submit_result_send = new JSONObject();
                        other_submit_result_send.put("messageType","otherError");
                        other_submit_result_send.put("errorMessage","시스템 에러");

                        BattleLog userBattleLog = BattleLog.builder().result("Error").memory("0").time("0").build();

                        if(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.userId.equals(submitUserId))
                        {
                            sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.battleLog.add(userBattleLog);
                        }
                        else if(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.userId.equals(submitUserId))
                        {
                            sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.battleLog.add(userBattleLog);
                        }

                        synchronized (session)
                        {
                            session.getBasicRemote().sendText(user_submit_result_send.toJSONString());
                        }
                        synchronized (userId2Session.get(submitOtherId))
                        {
                            userId2Session.get(submitOtherId).getBasicRemote().sendText(other_submit_result_send.toJSONString());
                        }
                    }
                    else
                    {
                        System.out.println("틀렸습니다.");
                        HashMap<String,Object> fromdata_info = (HashMap<String, Object>)fromdata.get("info");
                        List<HashMap<String,Object>> fromdata_info_data = (List<HashMap<String, Object>>) fromdata_info.get("data");
                        System.out.println("채첨 케이스 갯수 : " + fromdata_info_data.size());
                        int testCaseSize = fromdata_info_data.size();
                        int errorCnt = 0;
                        for(int i=0; i<testCaseSize; i++)
                        {
                            int error_check = (int) fromdata_info_data.get(i).get("result");
//                            HashMap<String,Integer> fromdata_info_data_error = (HashMap<String,Integer>) fromdata_info_data.get(i).get("error");
                            if(error_check==-1)
                            {
                                errorCnt++;
                            }
                        }
                        System.out.println(fromdata_info_data.size()+"개 중 "+(fromdata_info_data.size()-errorCnt)+"개 맞음");
                        JSONObject submit_fail_send = new JSONObject();
                        submit_fail_send.put("messageType","submitResult");
                        submit_fail_send.put("submitResult","fail");
                        submit_fail_send.put("testcase",fromdata_info_data.size());
                        submit_fail_send.put("accepted",fromdata_info_data.size()-errorCnt);

                        JSONObject other_submit_fail_send = new JSONObject();
                        other_submit_fail_send.put("messageType","otherSubmitResult");
                        other_submit_fail_send.put("submitResult","fail");
                        other_submit_fail_send.put("testcase",fromdata_info_data.size());
                        other_submit_fail_send.put("accepted",fromdata_info_data.size()-errorCnt);


                        HashMap<String,Object> fromdata_statistic_info = (HashMap<String, Object>)fromdata.get("statistic_info");
                        BattleLog failBattleLog = BattleLog.builder().result("Failed").memory(fromdata_statistic_info.get("memory_cost").toString()).time(fromdata_statistic_info.get("time_cost").toString()).build();

                        if(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.userId.equals(submitUserId))
                        {
                            sessionId2Obj.get(userId2SessionId.get(submitUserId)).user1.battleLog.add(failBattleLog);
                        }
                        else if(sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.userId.equals(submitUserId))
                        {
                            sessionId2Obj.get(userId2SessionId.get(submitUserId)).user2.battleLog.add(failBattleLog);
                        }

                        synchronized (session){
                            session.getBasicRemote().sendText(submit_fail_send.toJSONString());
                        }
                        synchronized (userId2Session.get(submitOtherId)){
                            userId2Session.get(submitOtherId).getBasicRemote().sendText(other_submit_fail_send.toJSONString());
                        }
//                        System.out.println("빠져나옴"+fromdata);
                        break;
                    }
                }
            }
        }
    }

    /**
     * 웹소켓 사용자 연결 해제하는 경우 호출
     */
    @OnClose
    public void handleClose(Session session)
    {
        if (session != null)
        {
            String sessionId = session.getId();
            sessionSet.remove(sessionId);
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

    private class SessionTimerTask extends TimerTask {

        private Session session;
        private String userId;
        private String otherId;
        private String battleMode;


        public SessionTimerTask(Session session,String userId, String otherId,String battleMode) {
            this.session = session;
            this.userId = userId;
            this.otherId = otherId;
            this.battleMode = battleMode;
        }

        @Override
        public void run() {
            // 타이머가 실행될 때 수행할 작업
            System.out.println(session+"배틀 종료할게요 ????????????????");
            int user_mmr = 0;
            int other_mmr = 0;
            int user_time = -1;
            int user_memory = -1;
            int other_time = -1;
            int other_memory = -1;

            /**
             * 현재 userId가 user1일 경우.
             */

                user_time =sessionId2Obj.get(userId2SessionId.get(userId)).user1.accept_time;
                user_memory =sessionId2Obj.get(userId2SessionId.get(userId)).user1.accept_memory;
                other_time = sessionId2Obj.get(userId2SessionId.get(userId)).user2.accept_time;
                other_memory = sessionId2Obj.get(userId2SessionId.get(userId)).user2.accept_memory;
                user_mmr = sessionId2Obj.get(userId2SessionId.get(userId)).user1.prevMmr;
                other_mmr = sessionId2Obj.get(userId2SessionId.get(userId)).user2.prevMmr;


            /**
             * 둘 다 제출 기록이 없으면 무승부
             * 배틀 룸에 저장부터 해야함.
             */
            if((user_time==-1 && user_memory==-1) && (other_time==-1 && other_memory==-1))
            {
                System.out.println("두명 다 제출기록이 없습니다. 무승부 입니다.");
                float user_odds = 1.0f * 1.0f / (1 + 1.0f * (float)(Math.pow(10, 1.0f * (other_mmr - user_mmr) / 400)));
                int change_user_mmr = (int) (user_mmr+30*(0.5-user_odds));

                float other_odds = 1.0f * 1.0f / (1 + 1.0f * (float)(Math.pow(10, 1.0f * (user_mmr - other_mmr) / 400)));
                int change_other_mmr = (int) (other_mmr+30*(0.5-other_odds));

                int result_user_mmr = change_user_mmr-user_mmr;
                int result_other_mmr = change_other_mmr-other_mmr;

                sessionId2Obj.get(userId2SessionId.get(userId)).user1.nowMmr = change_user_mmr;
                sessionId2Obj.get(userId2SessionId.get(userId)).user2.nowMmr = change_other_mmr;

                Map<String, Object> sendBattleLog = new HashMap<>();
                sendBattleLog.put("battleMode",battleMode);
                sendBattleLog.put("probNum",sessionId2Obj.get(userId2SessionId.get(userId)).problemNum);
                sendBattleLog.put("userId",userId);
                sendBattleLog.put("otherId",otherId);
                sendBattleLog.put("userPrevMmr",sessionId2Obj.get(userId2SessionId.get(userId)).user1.prevMmr);
                sendBattleLog.put("userNowMmr",sessionId2Obj.get(userId2SessionId.get(userId)).user1.nowMmr);
                sendBattleLog.put("userSubmitLog",sessionId2Obj.get(userId2SessionId.get(userId)).user1.battleLog);
                sendBattleLog.put("otherPrevMmr", sessionId2Obj.get(userId2SessionId.get(otherId)).user2.prevMmr);
                sendBattleLog.put("otherNowMmr", sessionId2Obj.get(userId2SessionId.get(otherId)).user2.nowMmr);
                sendBattleLog.put("otherSubmitLog",sessionId2Obj.get(userId2SessionId.get(otherId)).user2.battleLog);
                System.out.println("배틀에 대한 기록입니다." + sendBattleLog);
                System.out.println("시간 제한 : "+sessionId2Obj.get(userId2SessionId.get(userId)).time_limit);
                System.out.println("메모리 제한 : "+sessionId2Obj.get(userId2SessionId.get(userId)).memory_limit);
                /**
                 * log-service로 전송하는 부분 추가
                 */
                String url_log = "http://i8b303.p.ssafy.io:9005/log-service/insertBattleLogByDraw";
                String getBattleLogSaveResult = restTemplate.postForObject(
                        url_log,
                        sendBattleLog,
                        String.class
                );
                /**
                 * 클라이언트로 전송하는 부분
                 * 비겼고 제출 이력이 없어서 time , memory는 0으로
                 */
                JSONObject user_draw_result_send = new JSONObject();
                JSONObject other_draw_result_send = new JSONObject();
                if(battleMode.equals("speed"))
                {

                    user_draw_result_send.put("messageType","battleResult");
                    user_draw_result_send.put("battleResult","draw");
                    user_draw_result_send.put("time","0");
                    user_draw_result_send.put("memory","0");
                    user_draw_result_send.put("changeExp","75");
                    user_draw_result_send.put("changeMmr",result_user_mmr);


                    other_draw_result_send.put("messageType","battleResult");
                    other_draw_result_send.put("battleResult","draw");
                    other_draw_result_send.put("time","0");
                    other_draw_result_send.put("memory","0");
                    other_draw_result_send.put("changeExp","75");
                    other_draw_result_send.put("changeMmr",result_other_mmr);
                }
                else if(battleMode.equals("optimization"))
                {
                    user_draw_result_send.put("messageType","battleResult");
                    user_draw_result_send.put("battleResult","draw_timeout");
                    user_draw_result_send.put("time","0");
                    user_draw_result_send.put("memory","0");
                    user_draw_result_send.put("changeExp","75");
                    user_draw_result_send.put("changeMmr",result_user_mmr);

                    other_draw_result_send.put("messageType","battleResult");
                    other_draw_result_send.put("battleResult","draw_timeout");
                    other_draw_result_send.put("time","0");
                    other_draw_result_send.put("memory","0");
                    other_draw_result_send.put("changeExp","75");
                    other_draw_result_send.put("changeMmr",result_other_mmr);
                }


                /**
                 * rank-service로 전송하는 부분 추가
                 */
                Map<String,String> sendBattleLogForRedis = new HashMap<>();
                sendBattleLogForRedis.put("user_id_1",userId);
                sendBattleLogForRedis.put("user_id_2",otherId);
                sendBattleLogForRedis.put("battle_mode",battleMode);
                sendBattleLogForRedis.put("mmr_1", String.valueOf(sessionId2Obj.get(userId2SessionId.get(userId)).user1.nowMmr));
                sendBattleLogForRedis.put("mmr_2", String.valueOf(sessionId2Obj.get(userId2SessionId.get(userId)).user2.nowMmr));
                sendBattleLogForRedis.put("winner","0");

                String url_rank = "http://i8b303.p.ssafy.io:9003/rank-service/battleResult";
                String sendRedisRankUpdate = restTemplate.postForObject(
                        url_rank,
                        sendBattleLogForRedis,
                        String.class
                );
                synchronized (session)
                {
                    try {
                        session.getBasicRemote().sendText(user_draw_result_send.toJSONString());
                        handleClose(session);
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }
                synchronized (userId2Session.get(otherId))
                {
                    try {
                        userId2Session.get(otherId).getBasicRemote().sendText(other_draw_result_send.toJSONString());
                        handleClose(userId2Session.get(otherId));
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }
            }
            /**
             * 제출 기록이 있는 경우,
             */
            else
            {
                int user_time_per = ((user_time/(sessionId2Obj.get(userId2SessionId.get(userId)).time_limit*1000))*100);
                int other_time_per = ((other_time/(sessionId2Obj.get(userId2SessionId.get(userId)).time_limit*1000))*100);
                int user_memory_per = ((user_memory/(sessionId2Obj.get(userId2SessionId.get(userId)).memory_limit*1024))*100);
                int other_memory_per = ((other_memory/(sessionId2Obj.get(userId2SessionId.get(userId)).memory_limit*1024))*100);
                int user_score = user_time_per+user_memory_per;
                int other_score = other_time_per+other_memory_per;
                Map<String, Object> sendBattleLogOptimazation = new HashMap<>();
                if(user_score>other_score)
                {
                    System.out.println("유저 1번이 이겼습니다.");
                    float user_odds = 1.0f * 1.0f / (1 + 1.0f * (float)(Math.pow(10, 1.0f * (other_mmr - user_mmr) / 400)));
                    int change_user_mmr = (int) (user_mmr+30*(1-user_odds));

                    float other_odds = 1.0f * 1.0f / (1 + 1.0f * (float)(Math.pow(10, 1.0f * (user_mmr - other_mmr) / 400)));
                    int change_other_mmr = (int) (other_mmr+30*(0-other_odds));

                    int result_user_mmr = change_user_mmr - user_mmr;
                    int result_other_mmr = change_other_mmr - other_mmr;

                    sessionId2Obj.get(userId2SessionId.get(userId)).user1.nowMmr = change_user_mmr;
                    sessionId2Obj.get(userId2SessionId.get(userId)).user2.nowMmr = change_other_mmr;
                    sendBattleLogOptimazation.put("battleMode",battleMode);
                    sendBattleLogOptimazation.put("probNum",sessionId2Obj.get(userId2SessionId.get(userId)).problemNum);
                    sendBattleLogOptimazation.put("winnerUserId",userId);
                    sendBattleLogOptimazation.put("loserUserId",otherId);
                    sendBattleLogOptimazation.put("winnerPrevMmr",sessionId2Obj.get(userId2SessionId.get(userId)).user1.prevMmr);
                    sendBattleLogOptimazation.put("winnerNowMmr",sessionId2Obj.get(userId2SessionId.get(userId)).user1.nowMmr);
                    sendBattleLogOptimazation.put("winnerSubmitLog",sessionId2Obj.get(userId2SessionId.get(userId)).user1.battleLog);
                    sendBattleLogOptimazation.put("loserPrevMmr", sessionId2Obj.get(userId2SessionId.get(userId)).user2.prevMmr);
                    sendBattleLogOptimazation.put("loserNowMmr", sessionId2Obj.get(userId2SessionId.get(userId)).user2.nowMmr);
                    sendBattleLogOptimazation.put("loserSubmitLog",sessionId2Obj.get(userId2SessionId.get(userId)).user2.battleLog);

                    String url_log = "http://i8b303.p.ssafy.io:9005/log-service/insertBattleLog";
                    String getBattleLogSaveResult = restTemplate.postForObject(
                            url_log,
                            sendBattleLogOptimazation,
                            String.class
                    );

                    /**
                     * Rank service로 보낼 데이터
                     */
                    Map<String,String> sendBattleLogForRedis = new HashMap<>();
                    sendBattleLogForRedis.put("user_id_1",userId);
                    sendBattleLogForRedis.put("user_id_2",otherId);
                    sendBattleLogForRedis.put("battle_mode",battleMode);
                    sendBattleLogForRedis.put("mmr_1", String.valueOf(sessionId2Obj.get(userId2SessionId.get(userId)).user1.nowMmr));
                    sendBattleLogForRedis.put("mmr_2", String.valueOf(sessionId2Obj.get(userId2SessionId.get(userId)).user2.nowMmr));
                    sendBattleLogForRedis.put("winner","1");

                    /**
                     * 클라이언트로 보낼 데이터
                     * 1번 유저가 이겼을 때
                     */
                    JSONObject user_win_result_send = new JSONObject();
                    user_win_result_send.put("messageType","battleResult");
                    user_win_result_send.put("battleResult","win");
                    user_win_result_send.put("time",user_time);
                    user_win_result_send.put("memory",user_memory);
                    user_win_result_send.put("changeExp","100");
                    user_win_result_send.put("changeMmr",result_user_mmr);

                    JSONObject other_lose_result_send = new JSONObject();
                    other_lose_result_send.put("messageType","battleResult");
                    other_lose_result_send.put("battleResult","lose");
                    other_lose_result_send.put("time",other_time);
                    other_lose_result_send.put("memory",other_memory);
                    other_lose_result_send.put("changeExp","50");
                    other_lose_result_send.put("changeMmr",result_other_mmr);

                    String url_rank = "http://i8b303.p.ssafy.io:9003/rank-service/battleResult";
                    String sendRedisRankUpdate = restTemplate.postForObject(
                            url_rank,
                            sendBattleLogForRedis,
                            String.class
                    );

                    synchronized (session)
                    {
                        try {
                            session.getBasicRemote().sendText(user_win_result_send.toJSONString());
                            handleClose(session);
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    }
                    synchronized (userId2Session.get(otherId))
                    {
                        try {
                            userId2Session.get(otherId).getBasicRemote().sendText(other_lose_result_send.toJSONString());
                            handleClose(userId2Session.get(otherId));
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    }
                }
                else if(user_score<other_score)
                {
                    System.out.println("유저 2번이 이겼습니다.");
                    float user_odds = 1.0f * 1.0f / (1 + 1.0f * (float)(Math.pow(10, 1.0f * (other_mmr - user_mmr) / 400)));
                    int change_user_mmr = (int) (user_mmr+30*(0-user_odds));

                    float other_odds = 1.0f * 1.0f / (1 + 1.0f * (float)(Math.pow(10, 1.0f * (user_mmr - other_mmr) / 400)));
                    int change_other_mmr = (int) (other_mmr+30*(1-other_odds));

                    int result_user_mmr = change_user_mmr - user_mmr;
                    int result_other_mmr = change_other_mmr - other_mmr;

                    sessionId2Obj.get(userId2SessionId.get(userId)).user1.nowMmr = change_user_mmr;
                    sessionId2Obj.get(userId2SessionId.get(userId)).user2.nowMmr = change_other_mmr;
                    sendBattleLogOptimazation.put("battleMode",battleMode);
                    sendBattleLogOptimazation.put("probNum",sessionId2Obj.get(userId2SessionId.get(userId)).problemNum);
                    sendBattleLogOptimazation.put("winnerUserId",otherId);
                    sendBattleLogOptimazation.put("loserUserId",userId);
                    sendBattleLogOptimazation.put("winnerPrevMmr",sessionId2Obj.get(userId2SessionId.get(userId)).user2.prevMmr);
                    sendBattleLogOptimazation.put("winnerNowMmr",sessionId2Obj.get(userId2SessionId.get(userId)).user2.nowMmr);
                    sendBattleLogOptimazation.put("winnerSubmitLog",sessionId2Obj.get(userId2SessionId.get(userId)).user2.battleLog);
                    sendBattleLogOptimazation.put("loserPrevMmr", sessionId2Obj.get(userId2SessionId.get(userId)).user1.prevMmr);
                    sendBattleLogOptimazation.put("loserNowMmr", sessionId2Obj.get(userId2SessionId.get(userId)).user1.nowMmr);
                    sendBattleLogOptimazation.put("loserSubmitLog",sessionId2Obj.get(userId2SessionId.get(userId)).user1.battleLog);

                    String url_log = "http://i8b303.p.ssafy.io:9005/log-service/insertBattleLog";
                    String getBattleLogSaveResult = restTemplate.postForObject(
                            url_log,
                            sendBattleLogOptimazation,
                            String.class
                    );

                    /**
                     * Rank service로 보낼 데이터
                     */
                    Map<String,String> sendBattleLogForRedis = new HashMap<>();
                    sendBattleLogForRedis.put("user_id_1",userId);
                    sendBattleLogForRedis.put("user_id_2",otherId);
                    sendBattleLogForRedis.put("battle_mode",battleMode);
                    sendBattleLogForRedis.put("mmr_1", String.valueOf(sessionId2Obj.get(userId2SessionId.get(userId)).user1.nowMmr));
                    sendBattleLogForRedis.put("mmr_2", String.valueOf(sessionId2Obj.get(userId2SessionId.get(userId)).user2.nowMmr));
                    sendBattleLogForRedis.put("winner","2");

                    /**
                     * 클라이언트로 보내기, 2번 유저가 이겼을 때.
                     */
                    JSONObject user_lose_result_send = new JSONObject();
                    user_lose_result_send.put("messageType","battleResult");
                    user_lose_result_send.put("battleResult","lose");
                    user_lose_result_send.put("time",user_time);
                    user_lose_result_send.put("memory",user_memory);
                    user_lose_result_send.put("changeExp","50");
                    user_lose_result_send.put("changeMmr",result_user_mmr);

                    JSONObject other_win_result_send = new JSONObject();
                    other_win_result_send.put("messageType","battleResult");
                    other_win_result_send.put("battleResult","win");
                    other_win_result_send.put("time",other_time);
                    other_win_result_send.put("memory",other_memory);
                    other_win_result_send.put("changeExp","100");
                    other_win_result_send.put("changeMmr",result_other_mmr);

                    String url_rank = "http://i8b303.p.ssafy.io:9003/rank-service/battleResult";
                    String sendRedisRankUpdate = restTemplate.postForObject(
                            url_rank,
                            sendBattleLogForRedis,
                            String.class
                    );

                    synchronized (session)
                    {
                        try {
                            session.getBasicRemote().sendText(user_lose_result_send.toJSONString());
                            handleClose(session);
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    }
                    synchronized (userId2Session.get(otherId))
                    {
                        try {
                            userId2Session.get(otherId).getBasicRemote().sendText(other_win_result_send.toJSONString());
                            handleClose(userId2Session.get(otherId));
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    }
                }
                else
                {
                    System.out.println("최적화전 비겼습니다.");
                    float user_odds = 1.0f * 1.0f / (1 + 1.0f * (float)(Math.pow(10, 1.0f * (other_mmr - user_mmr) / 400)));
                    int change_user_mmr = (int) (user_mmr+30*(0.5-user_odds));

                    float other_odds = 1.0f * 1.0f / (1 + 1.0f * (float)(Math.pow(10, 1.0f * (user_mmr - other_mmr) / 400)));
                    int change_other_mmr = (int) (other_mmr+30*(0.5-other_odds));

                    int result_user_mmr = change_user_mmr - user_mmr;
                    int result_other_mmr = change_other_mmr - other_mmr;

                    sessionId2Obj.get(userId2SessionId.get(userId)).user1.nowMmr = change_user_mmr;
                    sessionId2Obj.get(userId2SessionId.get(userId)).user2.nowMmr = change_other_mmr;

                    Map<String, Object> sendBattleLog = new HashMap<>();
                    sendBattleLog.put("battleMode",battleMode);
                    sendBattleLog.put("probNum",sessionId2Obj.get(userId2SessionId.get(userId)).problemNum);
                    sendBattleLog.put("userId",userId);
                    sendBattleLog.put("otherId",otherId);
                    sendBattleLog.put("userPrevMmr",sessionId2Obj.get(userId2SessionId.get(userId)).user1.prevMmr);
                    sendBattleLog.put("userNowMmr",sessionId2Obj.get(userId2SessionId.get(userId)).user1.nowMmr);
                    sendBattleLog.put("userSubmitLog",sessionId2Obj.get(userId2SessionId.get(userId)).user1.battleLog);
                    sendBattleLog.put("otherPrevMmr", sessionId2Obj.get(userId2SessionId.get(otherId)).user2.prevMmr);
                    sendBattleLog.put("otherNowMmr", sessionId2Obj.get(userId2SessionId.get(otherId)).user2.nowMmr);
                    sendBattleLog.put("otherSubmitLog",sessionId2Obj.get(userId2SessionId.get(otherId)).user2.battleLog);

                    String url_log = "http://i8b303.p.ssafy.io:9005/log-service/insertBattleLogByDraw";
                    String getBattleLogSaveResult = restTemplate.postForObject(
                            url_log,
                            sendBattleLog,
                            String.class
                    );

                    /**
                     * 클라이언트로 보낼 데이터
                     * 무승부니까 둘다 draw로 보냄
                     */
                    JSONObject user_draw_result_send = new JSONObject();
                    user_draw_result_send.put("messageType","battleResult");
                    user_draw_result_send.put("battleResult","draw");
                    user_draw_result_send.put("time",user_time);
                    user_draw_result_send.put("memory",user_memory);
                    user_draw_result_send.put("changeExp","75");
                    user_draw_result_send.put("changeMmr",result_user_mmr);

                    JSONObject other_draw_result_send = new JSONObject();
                    other_draw_result_send.put("messageType","battleResult");
                    other_draw_result_send.put("battleResult","draw");
                    other_draw_result_send.put("time",other_time);
                    other_draw_result_send.put("memory",other_memory);
                    other_draw_result_send.put("changeExp","75");
                    other_draw_result_send.put("changeMmr",result_other_mmr);


                    Map<String,String> sendBattleLogForRedis = new HashMap<>();
                    sendBattleLogForRedis.put("user_id_1",userId);
                    sendBattleLogForRedis.put("user_id_2",otherId);
                    sendBattleLogForRedis.put("battle_mode",battleMode);
                    sendBattleLogForRedis.put("mmr_1", String.valueOf(sessionId2Obj.get(userId2SessionId.get(userId)).user1.nowMmr));
                    sendBattleLogForRedis.put("mmr_2", String.valueOf(sessionId2Obj.get(userId2SessionId.get(userId)).user2.nowMmr));
                    sendBattleLogForRedis.put("winner","0");

                    String url_rank = "http://i8b303.p.ssafy.io:9003/rank-service/battleResult";
                    String sendRedisRankUpdate = restTemplate.postForObject(
                            url_rank,
                            sendBattleLogForRedis,
                            String.class
                    );
                    synchronized (session)
                    {
                        try {
                            session.getBasicRemote().sendText(user_draw_result_send.toJSONString());
                            handleClose(session);
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    }
                    synchronized (userId2Session.get(otherId))
                    {
                        try {
                            userId2Session.get(otherId).getBasicRemote().sendText(other_draw_result_send.toJSONString());
                            handleClose(userId2Session.get(otherId));
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    }
                }
            }
        }
    }
}

