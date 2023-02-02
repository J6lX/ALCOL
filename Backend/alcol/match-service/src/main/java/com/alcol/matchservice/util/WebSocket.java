
package com.alcol.matchservice.util;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Component
@ServerEndpoint(value="/websocket")
public class WebSocket {


    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    private ZSetOperations<String, Object> ranking;
    private int mmr;
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
            sessionMap.put(sessionId, session);
            printInfo();

            if (!runCheck) {
                TimerTask task = new TimerTask() {
                    @Override
                    public void run() {
                        LocalTime now = LocalTime.now();
                        System.out.println(now);  // 06:20:57.008731300
                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH시 mm분 ss초");
                        String formatedNow = now.format(formatter);

                        int randInt = Math.abs(random.nextInt()) % 100;
                        String msg = String.format("{%s} : [{%d}]{%s}", formatedNow, randInt, "서버에서 보내는 랜덤메세지 입니다.");
                        sendMessageToAll(msg);
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
    public void handleMessage(String jsonMessage, Session session) throws ParseException, IOException {
        if (session != null) {
            JSONParser parser = new JSONParser();
            JSONObject obj = (JSONObject) parser.parse(jsonMessage);
            System.out.println(jsonMessage);
            String method = obj.get("method").toString();
            Object object = null;
            System.out.println(method + " 메세지 요청 받음");
            System.out.println("음 ?");
            if (method.equals("init")) {
                System.out.println("이닛으로는 들어옴 ?");
                String id = obj.get("id").toString();
                String name = obj.get("name").toString();
                String mode = obj.get("Mode").toString();
//                String language = obj.get("Language").toString();
                mmr = ranking.score("speed", id).intValue();
//                handleClose(session);
                System.out.println("???여기서 터짐 ?");
//                mmr = getMMR(id);
                System.out.println(id +" "+ name+" "+ mode+" "+ mmr);
                if (refreshMap.containsKey(id + "고객")) {
                    LocalTime first = refreshMap.get(id + "고객");
                    LocalTime second = LocalTime.now();
                    if (Duration.between(first, second).getSeconds() <= 1) {
                        sendMessageToAll("[고객/" + name + "] 님이 새로고침 하셨어요~~");
                    } else {
                        sendMessageToAll("[고객/" + name + "] 님이 다시 들어오셨어요~~");
                    }
                }

                System.out.println("유저 입장");
//                getMMR(id);
                User user = User.builder().id(id).name(name).mode(mode).mmr(mmr).build();

                userSet.add(id);
                userMap.put(id, user);
                sessionId2Obj.put(session.getId(), user);
                for(int i=0; i< sessionMap.size(); i++){
//                    System.out.println(i+"바퀴째");
//                    System.out.println(sessionId2Obj.containsKey(i) && sessionId2Obj.get(i+"").mmr);
                    if((sessionId2Obj.size()>1 && sessionId2Obj.containsKey(i+"")) &&((sessionId2Obj.get(i+"").mmr - 30 <= mmr) && (mmr <= sessionId2Obj.get(i+"").mmr + 30 )))
                    {
                        System.out.println(sessionId2Obj.get(i+"").id);
                        System.out.println(id);
                        if(!sessionId2Obj.get(i+"").id.equals(id))
                        {
                            goWebRTC(sessionId2Obj.get(i+"").id, id);
                        break;
                        }
                    }
                }
            } else if (method.equals("msg")) {
                String msg = obj.get("msg").toString();
                StringBuilder sb = new StringBuilder();
                object = sessionId2Obj.get(session.getId());
                if (object instanceof User) {
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
    public void handleClose(Session session) {
        if (session != null) {
            String sessionId = session.getId();
            sessionSet.remove(sessionId);

            User user = sessionId2Obj.get(sessionId);
            sessionId2Obj.remove(sessionId);
            String type = null;
            String id = null;

            type = "고객";
            id = user.getId();
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
    public void handleError(Throwable t) {
        t.printStackTrace();
    }

    public void printInfo() {

        System.out.println("sessionSet" + sessionSet);
        System.out.println("userSet" + userSet);
        System.out.println("userMap" + userMap);
        System.out.println("sessionId2Obj" + sessionId2Obj);
        System.out.println("sessionMap" + sessionMap);
        System.out.println("------------------------------");
    }

    public Set<String> getSessionSet() {
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

    private int getMMR(String userId){
        System.out.println("getMMR 첫부분");

        System.out.println("getMMR 두번째 부분");
//        int mmr = Integer.parseInt(ranking.score("speed", userId).toString());
//        int mmr = Integer.parseInt(obj.get("MMR").toString());

        return mmr;
    }

    private void goWebRTC(String sId, String cId) {
        Session session = null;
        for (String sessionId : sessionId2Obj.keySet()) {
            Object obj = sessionId2Obj.get(sessionId);
            if ((obj instanceof User && ((User) obj).getId().equals(cId)) || (obj instanceof User && ((User) obj).getId().equals(sId))) {
                System.out.println(sId);
                System.out.println(cId);
                session = sessionMap.get(sessionId);
                System.out.println(session);
                JSONObject send = new JSONObject();
                send.put("method", "go");
                send.put("link", "gogogo");
                session.getAsyncRemote().sendText(send.toJSONString());
            }
        }
    }
}


