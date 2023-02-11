package com.alcol.rankservice.service;

import com.alcol.rankservice.dto.RankDto;

import java.util.List;
import java.util.Map;

public interface RankService
{
    public RankDto.Ranking responseUserInfo(String userId, String battleMode);
    public RankDto.UserData getUserData(String userId);
    public RankDto.WinLoseCount getWinLoseCount(String userId, String battleMode);
    public RankDto.RankingAndMMR getRankingAndMMR(String userId, String battleMode);
    public List<RankDto.Ranking> getAllRankingList(String battleMode, int pageNum);
    public RankDto.Ranking getSearchUserInfo(String battleMode, String nickname);
    public Map<String, List<RankDto.Top3Ranking>> getTop3UserList();

}
