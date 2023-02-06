package com.alcol.logservice.repository;

import com.alcol.logservice.entity.BattleLogEntity;
import org.springframework.data.repository.CrudRepository;

public interface BattleLogRepository extends CrudRepository<BattleLogEntity, Long>
{
    //    # 사용자 최신 MMR 가져오기
//    select *
//    from battle_log_tb
//    where my_user_id='8ce6ab3a-f437-4f74-a031-e90dd1c00f53' and battle_mode='?'
//    order by battle_log_no desc
//    limit 1;
    BattleLogEntity findTopByMyUserIdAndBattleModeOrderByBattleLogNoDesc(String userId, String battleMode);

    BattleLogEntity findTop10ByMyUserIdOrderByBattleLogNoDesc(String userId);
}
