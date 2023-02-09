
package com.alcol.battleservice.util;

import com.alcol.battleservice.config.ServerEndpointConfigurator;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
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

    private ZSetOperations<String, Object> ranking;
    private int userMmr;
    private int otherMmr;
    int mmrAvg;
    private static Set<String> sessionSet = new HashSet<String>();
    private static Map<String, Session> sessionMap = new HashMap<>();
    private static Map<String, BattleRoom> sessionId2Obj = new HashMap<>();
    private static Map<String, Session> userId2Session = new HashMap<>();
    private static Map<String, User> userMap = new HashMap<>();
    private static Set<String> userSet = new HashSet<String>();
    private static Map<String, LocalTime> refreshMap = new HashMap<>();
//    private static Map<String, Room> roomMap = new HashMap<>();

    static Random random = new Random();
    static boolean runCheck = false;

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
    public void handleMessage(String jsonMessage, Session session) throws ParseException, IOException
    {
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
                String url = "http://i8b303.p.ssafy.io:8000/problem-service/getThreeProblem?mmr="+mmrAvg;

//                ResponseEntity<JSONObject> problems = restTemplate.getForEntity(url,JSONObject.class);
                List<Map<String,String>> problems = restTemplate.getForObject(url,List.class);
                for(int i=0; i<problems.size(); i++)
                {
                    Map<String,String> prob = problems.get(i);
                    System.out.println(prob.toString());

                }

                User user = User.builder().session(session).userId(userId).prevMmr(userMmr).battleMode(battleMode).build();
                if(sessionMap.containsKey(otherUserId))
                {
                    sessionId2Obj.get(otherUserId).user2 = user;
                    userId2Session.put(userId, userId2Session.get(otherUserId));
                    System.out.println("이미 만들어져 있음 : "+ sessionMap.get(otherUserId).getId());
                    session.getAsyncRemote().sendText("connect_success");
                    userId2Session.get(otherUserId).getAsyncRemote().sendText("connect_success");
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
                    System.out.println("이번에 만들어짐 : " + sessionMap);
                    System.out.println("this is restTempalte : "+ restTemplate);
                }
                System.out.println();
//                session.getAsyncRemote().sendText("connect_success");


            }
            /**벤픽 시작 전 3문제 얻어오기 요청 수행 (problem Service로 요청 전달)*/
            else if (method.equals("getProblem"))
            {
                String userId = obj.get("userId").toString();

//                System.out.println(problems.toString());
                JSONObject problems_json = new JSONObject();
//                problems_json.put()
                sendProblems(session, problems_json);

                /****문제를 보내고 벤픽 시간을 제한해야 함****/

                JSONObject banResult_json = new JSONObject();
                TimerTask task = new TimerTask() {
                    @Override
                    public void run() {
                        String sessionId = userId2Session.get(userId).getId();
                        int size = sessionId2Obj.get(sessionId).problemList.size();
                        List<Integer> randomProblemList = new ArrayList<>();
                        for (String key : sessionId2Obj.get(sessionId).problemList.keySet())
                        {
                            if(sessionId2Obj.get(sessionId).problemList.get(key))
                            {
                                randomProblemList.add(Integer.parseInt(key));
                            }
                        }

                        /**밴픽 시간이 다 지난 후에 밴픽을 끝내는 메시지와 함께 문제 전송*/
                        Random random = new Random();
                        int randomIndex = random.nextInt(randomProblemList.size());
                        int selectProblemNum = randomProblemList.get(randomIndex);
                        sessionId2Obj.get(sessionId).problemNum = selectProblemNum;
//                        String url = "http://localhost:9005/getProblem/"+selectProblemNum;
//                        ResponseEntity<List> problem = restTemplate.getForEntity(url,List.class);
//                        banResult_json.put("messageType","select_sucess");
//                        banResult_json.put("problemNum",selectProblemNum);
                        //문제 이름, 번호같은 디테일 넣어야 함.
//                        banResult_json.put("problemName",)
                    }
                };
                runCheck = true;
                Timer timer = new Timer(true);
                long delay = 5000;
                timer.schedule(task, delay);

            }
            /**사용자가 밴을 할 때 들어오는 곳, 문제를 false로 바꿈*/
            else if (method.equals("ban"))
            {
                String userId = obj.get("userId").toString();
                String problemNum = obj.get("problemNum").toString();
                String sessionId = userId2Session.get(userId).getId();
                sessionId2Obj.get(sessionId).problemList.put(problemNum,false);
            }

            /**문제를 제출했을 때 들어오는 곳, 채점서버로 요청 보내야 함.*/
            else if (method.equals("submit"))
            {
                String userId = obj.get("userId").toString();
                String problemNum = obj.get("problemNum").toString();
                String submitCode = obj.get("code").toString();

                String url = "http://localhost:9005/getProblem/";
                ResponseEntity<List> problem = restTemplate.getForEntity(url,List.class);

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
        if (session != null)
        {
            String sessionId = session.getId();
            sessionSet.remove(sessionId);

//            User user = sessionId2Obj.get(sessionId);
            sessionId2Obj.remove(sessionId);
            String type = null;
            String id = null;

            type = "고객";
//            id = user.getId();
            userSet.remove(id);
            userMap.remove(id);

            refreshMap.put(id + type, LocalTime.now());
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

}


