package com.alcol.rankservice.service;

import com.alcol.rankservice.dto.RankDto;

import java.util.List;

public interface RankService
{
    public int getMyRank(String userId, String mode);
    public RankDto.UserData getUserData(String userId);
    public RankDto.WinLoseCount getWinLoseCount(String userId, String battleMode);
    public RankDto.RankingAndMMR getRankingAndMMR(String userId, String battleMode);
    public List<RankDto.Ranking> getAllRankingList(String battleMode, int pageNum);
//    public void getAllRankingList(String battleMode, int pageNum);

}
