
package com.alcol.matchservice.util;

import com.alcol.matchservice.config.ServerEndpointConfigurator;
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
import org.springframework.web.socket.server.standard.SpringConfigurator;

import javax.inject.Inject;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import javax.ws.rs.core.MultivaluedMap;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Component
@ServerEndpoint(value="/match-service", configurator = ServerEndpointConfigurator.class)
public class WebSocket {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private RestTemplate restTemplate;
    private ZSetOperations<String, Object> ranking;
    private int mmr;
    private boolean host_user = false;
    private static Set<String> sessionSet = new HashSet<String>();
    private static Map<String, Session> sessionMap = new HashMap<>();
    private static Map<String, User> sessionId2Obj = new HashMap<>();
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
            System.out.println("이것은 세션 아이디이다."+sessionId);
            sessionMap.put(sessionId, session);
            printInfo();

//            if (!runCheck) {
//                TimerTask task = new TimerTask() {
//                    @Override
//                    public void run() {
//                        LocalTime now = LocalTime.now();
//                        System.out.println(now);  // 06:20:57.008731300
//                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH시 mm분 ss초");
//                        String formatedNow = now.format(formatter);
//
//                        int randInt = Math.abs(random.nextInt()) % 100;
//                        String msg = String.format("{%s} : [{%d}]{%s}", formatedNow, randInt, "서버에서 보내는 랜덤메세지 입니다.");
//                        sendMessageToAll(msg);
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
    public void handleMessage(String jsonMessage, Session session) throws ParseException, IOException
    {
        if (session != null)
        {
            JSONParser parser = new JSONParser();
            System.out.println("핸들로 들어오는 json 메세지 " + jsonMessage);
            JSONObject obj = (JSONObject) parser.parse(jsonMessage);
            System.out.println(jsonMessage);
            String method = obj.get("method").toString();
            Object object = null;
            System.out.println(method + " 메세지 요청 받음");
            System.out.println("음 ?");
            if (method.equals("init"))
            {
                System.out.println("이닛으로는 들어옴 ?");
                String id = obj.get("id").toString();

                String mode = obj.get("Mode").toString();
                String language = obj.get("Language").toString();
                System.out.println("redis : "+redisTemplate);
                ranking = redisTemplate.opsForZSet();
                try
                {
                    mmr = ranking.score(mode, id).intValue();
                }
                catch (Exception e)
                {
                    MultiValueMap<String, String> bodyData = new LinkedMultiValueMap<>();
                    bodyData.add("user_id",id);
                    bodyData.add("mode",mode);
                    System.out.println("this is restTempalte : "+ restTemplate);
                    String url = "http://i8B303.p.ssafy.io:9005/log-service/getLevelAndTier";
                    ResponseEntity<List> MMRs = restTemplate.postForEntity(
                            url,
                            bodyData,
                            List.class
                    );
                }
//                handleClose(session);
                System.out.println(mmr);
                System.out.println("???여기서 터짐 ?");
//                mmr = getMMR(id);
//
//                System.out.println(MMRs);
                System.out.println(id +" "+ id+" "+ mode+" "+ mmr);
                if (refreshMap.containsKey(id + "고객"))
                {
//                    LocalTime first = refreshMap.get(id + "고객");
//                    LocalTime second = LocalTime.now();
//                    if (Duration.between(first, second).getSeconds() <= 1)
//                    {
//                        sendMessageToAll("[고객/" + name + "] 님이 새로고침 하셨어요~~");
//                    }
//                    else
//                    {
//                        sendMessageToAll("[고객/" + name + "] 님이 다시 들어오셨어요~~");
//                    }
                }

                System.out.println("유저 입장");
                User user = User.builder().id(id).mode(mode).mmr(mmr).language(language).build();

                userSet.add(id);
                userMap.put(id, user);
                sessionId2Obj.put(session.getId(), user);
                for(String i : sessionMap.keySet())
                {
//                    System.out.println("언어가 같은지?" + sessionId2Obj.get(i+"").language.equals(language));
//                    System.out.println("모드가 같은지?" + sessionId2Obj.get(i+"").mode.equals(mode));
                    if(
                            (sessionId2Obj.size()>1 && sessionId2Obj.containsKey(i+"")) &&
                            ((sessionId2Obj.get(i).mode.equals(mode)) &&
                            (sessionId2Obj.get(i).language.equals(language))&&
                            (
                                    (sessionId2Obj.get(i).mmr - 100 <= mmr) &&
                                    (mmr <= sessionId2Obj.get(i).mmr + 100 )
                            )
                    ))
                    {
                        System.out.println(sessionId2Obj.get(i).id);
                        System.out.println(id);
                        if(!sessionId2Obj.get(i).id.equals(id))
                        {

                            host_user = true;
                            goBattle(sessionId2Obj.get(i).id, id,host_user);
                            break;
                        }
                    }
//                    System.out.println("세션 아이디 : "+sessionId2Obj.get(i).id);
                }
            }
            else if (method.equals("matchCancle"))
            {
                String userId = obj.get("userId").toString();
                handleClose(session);

            }
            else if (method.equals("msg"))
            {
                String msg = obj.get("msg").toString();
                StringBuilder sb = new StringBuilder();
                object = sessionId2Obj.get(session.getId());
                if (object instanceof User)
                {
                    String id = ((User) object).getId();
                    String name = userMap.get(id).getName();
                    sb.append("[유저/").append(name).append("]");
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

            User user = sessionId2Obj.get(sessionId);
            sessionMap.remove(sessionId);
            sessionId2Obj.remove(sessionId);
            String type = null;
            String id = null;

            type = "고객";
            id = user.getId();
            userSet.remove(id);
            userMap.remove(id);

//            refreshMap.put(id + type, LocalTime.now());
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

    private void goBattle(String player1Id, String player2Id,Boolean host_user) {
        Session session = null;
        for (String sessionId : sessionId2Obj.keySet()) {
            Object obj = sessionId2Obj.get(sessionId);
            if ((obj instanceof User && ((User) obj).getId().equals(player2Id)) || (obj instanceof User && ((User) obj).getId().equals(player1Id))) {
                System.out.println("이건 뭐고 ? : "+player1Id);
                System.out.println("저건 뭐고 ? : "+player2Id);
                session = sessionMap.get(sessionId);
                System.out.println(session);
                JSONObject send = new JSONObject();
                if(((User) obj).getId().equals(player2Id)){
                    host_user=true;
                    send.put("userId", player2Id);
                    send.put("otherId", player1Id);
                    send.put("hostCheck",host_user);
//                    System.out.println("보내기 직전 send Json : "+send.toJSONString());
                    session.getAsyncRemote().sendText(send.toJSONString());
                }
                else{
                    host_user = false;
                    send.put("userId", player1Id);
                    send.put("otherId", player2Id);
                    send.put("hostCheck",host_user);
//                    System.out.println("보내기 직전 send Json : "+send.toJSONString());

                    session.getAsyncRemote().sendText(send.toJSONString());
                }
//                handleClose(session);

//                    session.sendMessage(message);
//                    session.getAsyncRemote().sendText(send.toJSONString());

            }
        }
    }
}


