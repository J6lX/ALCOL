
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
    private int mmr;
    private static Set<String> sessionSet = new HashSet<String>();
    private static Map<String, Session> sessionMap = new HashMap<>();
    private static Map<String, BattleRoom> sessionId2Obj = new HashMap<>();
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
            String method = obj.get("method").toString();
            Object object = null;
            if (method.equals("init"))
            {
                String userId = obj.get("userId").toString();
                String otherUserId = obj.get("otheruserId").toString();
                String battleMode = obj.get("battleMode").toString();
                ranking = redisTemplate.opsForZSet();
                try
                {
                    mmr = ranking.score("speed", userId).intValue();
                }
                catch (Exception e)
                {
                    MultiValueMap<String, String> bodyData = new LinkedMultiValueMap<>();
                    bodyData.add("user_id",userId);
                    bodyData.add("mode",battleMode);
                    System.out.println("this is restTempalte : "+ restTemplate);
                    String url = "http://localhost:9005/log-service/getLevelAndTier";
                    ResponseEntity<List> MMRs = restTemplate.postForEntity(
                            url,
                            bodyData,
                            List.class
                    );
                }
                User user = User.builder().session(session).userId(userId).prevMmr(mmr).battleMode(battleMode).build();
                if(sessionMap.containsKey(otherUserId))
                {
                    sessionId2Obj.get(otherUserId).user2 = user;
                    System.out.println("이미 만들어져 있음 : "+ sessionMap.get(otherUserId).getId());
                }
                else
                {
//                    User user = User.builder().session(session).userId(userId).prevMmr(mmr).build();
                    BattleRoom battleRoom = BattleRoom.builder().user1(user).build();
                    sessionMap.put(userId, session);
                    sessionId2Obj.put(userId, battleRoom);
                    System.out.println("이번에 만들어짐 : " + sessionMap);
                }
                System.out.println();


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


