package com.alcol.logservice.repository;

import com.alcol.logservice.entity.BattleLogEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface BattleLogRepository extends CrudRepository<BattleLogEntity, Long>
{
    //    # 사용자 모드별 현재 MMR 가져오기
//    select *
//    from battle_log_tb
//    where my_user_id=? and battle_mode=?
//    order by battle_log_no desc
//    limit 1;
    BattleLogEntity findTopByMyUserIdAndBattleModeOrderByBattleLogNoDesc(String userId, String battleMode);

    // 사용자의 최신 배틀 로그 10 개 가져오기
    List<BattleLogEntity> findAllByMyUserIdOrderByBattleLogNoDesc(String userId);

    // 사용자의 모드별 승리, 패배수 가져오기
    Long countByMyUserIdAndBattleModeAndBattleResult(String userId, String battleMode, int battleResult);
}
