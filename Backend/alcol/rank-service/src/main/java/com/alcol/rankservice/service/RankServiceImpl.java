package com.alcol.rankservice.service;

import com.alcol.rankservice.dto.RankDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class RankServiceImpl implements RankService{
    private final RedisTemplate<String, Object> redisTemplate;
    private final RestTemplate restTemplate;
    private final BattleResultService battleResultService;
    private ZSetOperations<String, Object> ranking;
    private HashOperations<String, String, String> winLoseCount;
    private HashOperations<String, String, String> userInfo;

    /**
    * 랭킹 페이지에 보여주기 위해 유저 정보를 가져오는 메소드
    * */
    public RankDto.UserData getUserData(String userId)
    {
        userInfo = redisTemplate.opsForHash();
        String key = "userInfo:" + userId;

        // redis에 정보가 없다면 user-service에게 요청해 가져오고 redis에 저장한다.
        if(!userInfo.hasKey(key, "nickname"))
        {
            log.info(userId + "에 대한 유저 데이터가 레디스에 존재하지 않습니다.");
            battleResultService.recordUserData(userId);
        }

        int level = 0;
        // redis에서 유저 정보를 가져온다.
        String nickname = userInfo.get(key, "nickname");
        String profilePic = userInfo.get(key, "stored_file_name");
        if(userInfo.get(key, "level") != null)
            level = Integer.valueOf(userInfo.get(key, "level"));
        String speedTier = userInfo.get(key, "speed_tier");
        String optimizationTier = userInfo.get(key, "optimization_tier");


        return RankDto.UserData.builder()
                .nickname(nickname)
                .stored_file_name(profilePic)
                .level(level)
                .speed_tier(speedTier)
                .optimization_tier(optimizationTier)
                .build();
    }

    /**
     * 유저의 승리 수, 패배 수, 승률을 구하기 위해 redis에 접근해 해당 정보를 가져오는 메소드
     * */
    public RankDto.WinLoseCount getWinLoseCount(String userId, String battleMode)
    {
        winLoseCount = redisTemplate.opsForHash();
        String key = "winloseCnt:" + userId + ":" + battleMode;

        int win = -1;
        int lose = -1;
        long winningRate = -1;
        try
        {
            win = Integer.parseInt(winLoseCount.get(key, "win"));
            lose = Integer.parseInt(winLoseCount.get(key, "lose"));
            winningRate = win / (win + lose) * 100;
        }
        catch (Exception e)
        {
            log.warn("해당 유저의 승패 정보가 존재하지 않음 - " + userId);
            return RankDto.WinLoseCount.builder()
                    .win(0)
                    .lose(0)
                    .winningRate(0)
                    .build();
        }

        return RankDto.WinLoseCount.builder()
                .win(win)
                .lose(lose)
                .winningRate(winningRate)
                .build();
    }

    /**
     * redis에 접근해 랭킹과 MMR 정보를 가져오는 메소드
     * */
    public RankDto.RankingAndMMR getRankingAndMMR(String userId, String battleMode)
    {
        ranking = redisTemplate.opsForZSet();

        long grade = -1;
        int MMR = -1;
        try
        {
            grade = ranking.reverseRank(battleMode, userId);
            MMR = ranking.score(battleMode, userId).intValue();
        }
        catch (NullPointerException nullPointerException)
        {
            log.warn("해당 유저의 랭킹 정보가 존재하지 않음");
        }

        return RankDto.RankingAndMMR.builder()
                .grade(grade)
                .MMR(MMR)
                .build();
    }

    /**
     * 모드에 따라 모든 유저의 랭킹 정보를 가져오는 메소드
     * */
    public List<RankDto.Ranking> getAllRankingList(String battleMode, int pageNum)
    {
        List<RankDto.Ranking> RankingList = new ArrayList<>();
        ranking = redisTemplate.opsForZSet();
        // 랭킹을 정렬된 Set 형태로 받아온다.
        Set<Object> rankUserIds= ranking.reverseRange(battleMode, (pageNum-1) * 50 ,50 * pageNum - 1);
        // 비었으면 랭킹 정보가 존재하지 않는다는 의미이다.
        if(rankUserIds.isEmpty()){
            log.warn(battleMode + " 모드에 대한 랭킹 정보가 존재하지 않습니다.");
            return RankingList;
        }

        // Set 타입이라서 iterator 사용해서 읽는다.
        Iterator<Object> iterator = rankUserIds.iterator();

        int grade = (pageNum-1) * 50 + 1;
        while(iterator.hasNext()){
            String userId = String.valueOf(iterator.next());
            int mmr = ranking.score(battleMode, userId).intValue();

            // 해당 유저의 승패수를 가져온다.
            RankDto.WinLoseCount winLose = getWinLoseCount(userId, battleMode);
            // 해당 유저의 정보를 가져온다.
            RankDto.UserData userData = getUserData(userId);
            String tier = battleMode.equals("speed") ? userData.getSpeed_tier() : userData.getOptimization_tier();

            RankingList.add(RankDto.Ranking.builder()
                            .nickname(userData.getNickname())
                            .profile_pic(userData.getStored_file_name())
                            .level(userData.getLevel())
                            .tier(tier)
                            .mmr(mmr)
                            .grade(grade++)
                            .record(winLose)
                            .build());
        }

        return RankingList;
    }

    /**
     * 닉네임으로 UserId를 검색하는 메소드
     * */
    public String SearchUserIdUsingNickname(String nickname)
    {
        // 닉네임으로 유저 아이디 요청해서 가져옴 (user-service)
        Map<String, String> map = new HashMap<>();
        map.put("nickname", nickname);
        String url = "http://i8b303.p.ssafy.io:8000/user-service/getUserId";
        return restTemplate.postForObject(url, map, String.class);
    }
    /**
     * 랭킹 페이지에서 유저 검색하면 유저 정보 넘기는 메소드
     * */
    public RankDto.Ranking getSearchUserInfo(String battleMode, String nickname)
    {
        String searchUserId = SearchUserIdUsingNickname(nickname);

        // 해당 닉네임이 존재하지 않을 경우
        if(searchUserId.equals("noneUserId"))
        {
            return null;
        }

        // 받은 userId로 보여줄 userData 받아옴
        RankDto.Ranking searchUserInfo = responseUserInfo(searchUserId, battleMode);
        return searchUserInfo;
    }

    /**
     * 보여줄 개인유저 데이터
     * */
    public RankDto.Ranking responseUserInfo(String userId, String battleMode)
    {
        RankDto.UserData userData = getUserData(userId);
        RankDto.WinLoseCount winLoseCount = getWinLoseCount(userId, battleMode);
        RankDto.RankingAndMMR rankingAndMMR = getRankingAndMMR(userId, battleMode);

        // battleMode가 스피드전이라면 스피드전 티어를, 최적화전이라면 최적화전 티어를 보내줘야함
        String tier = "";
        if(battleMode.equals("speed")) tier = userData.getSpeed_tier();
        else tier = userData.getOptimization_tier();

        RankDto.Ranking rank = RankDto.Ranking.builder()
                .nickname(userData.getNickname())
                .profile_pic(userData.getStored_file_name())
                .level(userData.getLevel())
                .tier(tier)
                .mmr(rankingAndMMR.getMMR())
                .record(winLoseCount)
                .grade(rankingAndMMR.getGrade() + 1)
                .build();

        return rank;
    }

    /**
     * 모드별 Top3 유저 리스트를 반환하는 메소드
     * */
    public Map<String, List<RankDto.Top3Ranking>> getTop3UserList()
    {
        ranking = redisTemplate.opsForZSet();
        Map<String, List<RankDto.Top3Ranking>> modeTop3 = new HashMap<>();
        List<RankDto.Top3Ranking> speedTop3 = new ArrayList<>();
        List<RankDto.Top3Ranking> optTop3 = new ArrayList<>();

        // 스피드전 top3의 userId 받아오기
        Set<Object> speedRankUserIds= ranking.reverseRange("speed", 0,2);
        // 비었으면 랭킹 정보가 존재하지 않는다는 의미이다.
        if(speedRankUserIds.isEmpty()){
            log.warn("스피드 모드에 대한 랭킹 정보가 존재하지 않습니다.");
            return null;
        }

        Iterator<Object> iterator = speedRankUserIds.iterator();
        int grade = 1;
        while(iterator.hasNext())
        {
            String userId = String.valueOf(iterator.next());
            // userId로 닉네임과 프로필사진 가져오기
            RankDto.UserData userInfo = getUserData(userId);
            // 스피드전 TOP3 리스트에 넣기
            speedTop3.add(new RankDto.Top3Ranking(grade++, userInfo.getNickname(), userInfo.getStored_file_name()));
        }

        // 스피드전 TOP3 맵으로 엮어서 response할 List에 넣기
        modeTop3.put("speed", speedTop3);

        // 최적화전 top3의 userId 받아오기
        Set<Object> optRankUserIds= ranking.reverseRange("optimization", 0,2);
        // 비었으면 랭킹 정보가 존재하지 않는다는 의미이다.
        if(optRankUserIds.isEmpty()){
            log.warn("최적화 모드에 대한 랭킹 정보가 존재하지 않습니다.");
            return null;
        }

        iterator = optRankUserIds.iterator();
        grade = 1;
        while(iterator.hasNext())
        {
            String userId = String.valueOf(iterator.next());
            // userId로 닉네임과 프로필사진 가져오기
            RankDto.UserData userInfo = getUserData(userId);
            // 최적화전 TOP3 리스트에 넣기
            optTop3.add(new RankDto.Top3Ranking(grade++, userInfo.getNickname(), userInfo.getStored_file_name()));
        }

        // 최적화전 TOP3 맵으로 엮어서 response할 List에 넣기
        modeTop3.put("optimization", optTop3);


        return modeTop3;

    }
}
